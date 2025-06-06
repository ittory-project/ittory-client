import { Client, IMessage, StompSubscription } from '@stomp/stompjs';

import { SessionLogger, assert } from '@/utils';

import { createStompClient } from './stompjs';

type RequestMapper<Payload> = (payload: Payload) => string;

type ResponseHandler<Payload> = (payload: Payload) => void;

type ResponseHandlers = Record<string, ResponseHandler<string>>;

type ChannelConfig<Handlers extends ResponseHandlers> = (
  handlers: Handlers,
) => (payload: string) => void;

// 전체 Definition 타입
// 되게 단순함 이거는 channelMapper랑 payloadMapper만 있으면 됨
export type RequestMapperDefinition = Record<
  string,
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channelMapper: (...args: any[]) => string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestMapper?: RequestMapper<any>;
  }
>;

export type ResponseMapperDefinition = Record<
  string,
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channelMapper: (...args: any[]) => string;
    responseMapper: ChannelConfig<ResponseHandlers>;
  }
>;

const logger = new SessionLogger('websocket-infra');

export class SharedTypeSafeWebSocket<
  UserRequestMapperDefinition extends RequestMapperDefinition,
  UserResponseMapperDefinition extends ResponseMapperDefinition,
> {
  private requestDefinition: UserRequestMapperDefinition;
  private responseDefinition: UserResponseMapperDefinition;
  private observersByChannel: Map<
    keyof UserResponseMapperDefinition,
    ResponseHandler<string>[]
  >;
  private isConnected = false;
  private isConnecting = false; // NOTE: 중복 activate 호출 방지
  private isReconnecting = false; // NOTE: 중복 onConnect 호출 방지

  // NOTE: 연결 상태가 아닐 때 클라이언트 요청이 발생하는 경우 해당 큐에서 대기.
  // 연결 시 모든 큐에서 대기하던 작업을 실행하고 큐를 비움
  private connectWaitQueue: (() => void)[] = [];

  // NOTE: 연결/재연결 시점마다 매번 호출되어야 하는 작업을 추가
  private onConnectQueue: (() => void)[] = [];

  // stomp-specific
  private stompClient: Client;
  private stompRawSubscriptionObjects: Map<
    keyof UserResponseMapperDefinition,
    StompSubscription
  >;
  private stompSingletonChannelSubscribers: Map<
    keyof UserResponseMapperDefinition,
    (message: IMessage) => void
  >;

  constructor(
    requestMapperDefinition: UserRequestMapperDefinition,
    responseMapperDefinition: UserResponseMapperDefinition,
  ) {
    this.requestDefinition = requestMapperDefinition;
    this.responseDefinition = responseMapperDefinition;

    this.observersByChannel = new Map();
    this.connectWaitQueue = [];

    // stomp-specific
    this.stompRawSubscriptionObjects = new Map();
    this.stompSingletonChannelSubscribers = new Map();

    // stomp-client specific
    this.stompClient = createStompClient();
    this.stompClient.onConnect = (iframe) => {
      logger.debug('onConnect', iframe);

      this.connectWaitQueue.forEach((job) => job());
      this.connectWaitQueue = [];

      // NOTE: onConnect의 경우 reconnect에서도 실행해야 할 작업을 등록하는 것
      this.onConnectQueue.forEach((job) => job());

      this.isConnected = true;
      this.isConnecting = false;

      this.subscribeWaitingSubscriptions();
    };
    this.stompClient.onDisconnect = () => {
      this.isConnected = false;
      this.isConnecting = false;
      this.isReconnecting = true;
      this.stompRawSubscriptionObjects.clear();
      logger.debug('onDisconnect');
    };
    this.stompClient.onWebSocketClose = (event) => {
      logger.debug('onWebSocketClose', event);
    };

    this.checkAndConnect();
  }

  // NOTE: activate 이전에 호출됨
  public subscribe<Channel extends keyof UserResponseMapperDefinition>(
    channel: Channel,
    channelMapperParams: Parameters<
      UserResponseMapperDefinition[Channel]['channelMapper']
    >,
    handlerConfig: Parameters<
      UserResponseMapperDefinition[Channel]['responseMapper']
    >[0],
  ) {
    this.checkAndConnect();

    const channelName = this.responseDefinition[channel].channelMapper(
      ...channelMapperParams,
    );
    logger.debug('subscribe - channelName', channelName);

    // 아직 리스너 배열이 없으면 리스너 배열 생성
    const oberversForChannel = this.observersByChannel.get(channelName) ?? [];
    if (!this.observersByChannel.has(channelName)) {
      this.observersByChannel.set(channelName, oberversForChannel);
    }

    const newChannelObserver = this.responseDefinition[channel]
      .responseMapper(handlerConfig)
      .bind(this.responseDefinition[channel]);

    oberversForChannel.push(newChannelObserver);

    if (!this.isSubscribedOnStomp(channelName)) {
      // FIXME: stomp-specific && 실제로 string으로 올텐데 왜 IMessage 타입인지 확인 필요
      const callListeners = (message: IMessage) => {
        logger.debug(
          'calling all callListeners with',
          message,
          oberversForChannel,
        );

        // oberversForChannel 로 해두면 이후의 subscriber를 호출하지 않게 됨;
        this.observersByChannel
          .get(channelName)
          ?.forEach((listener) => listener(message.body));
      };

      // NOTE: useEffect의 호출 시점에 따라 이미 connect됐을 수도 있음. (서버 연결 vs useEffect 호출 경합 발생)
      this.subscribeOnStompSafely(channelName, callListeners);
    }

    // 모든 listeners가 없으면 구독도 종료
    return () => {
      // NOTE: 다른 코드에서 먼저 덮어쓸 수 있으므로 항상 최신 값을 가져와야 함
      const oberversForChannel = this.observersByChannel.get(channelName);
      assert(oberversForChannel, 'oberversForChannel not found');

      const nextOberversForChannel = oberversForChannel.filter(
        (listener) => listener !== newChannelObserver,
      );

      logger.debug(
        'unsubscribing',
        channelName,
        ', observer: ',
        newChannelObserver,
        ', after unsub:',
        oberversForChannel,
      );

      this.observersByChannel.set(channelName, nextOberversForChannel);

      if (nextOberversForChannel.length === 0) {
        logger.debug('no listeners left, unsubscribing', channelName);

        this.observersByChannel.delete(channelName);
        this.unsubscribeOnStomp(channelName);

        logger.debug(
          'no listeners left, unsubscribing',
          channelName,
          ', this.observersByChannel:',
          this.observersByChannel,
          ', this.stompSubscriptions:',
          this.stompRawSubscriptionObjects,
        );
      }

      if (this.observersByChannel.size === 0) {
        this.intentionallyDisconnect();
      }
    };
  }

  // TODO: type-safe하게 channel, payload 타입 제한 필요
  public send<Channel extends keyof UserRequestMapperDefinition & string>(
    channel: Channel,
    channelMapperParams: Parameters<
      UserRequestMapperDefinition[Channel]['channelMapper']
    >,
    // NOTE: rest parameter로 타입을 정의해야 인자 존재 여부 자체를 분기할 수 있음.
    // `...args: []`로 타입을 정의하면 추가 인자 없음을 표시할 수 있기 때문임
    // 현재 UserRequestMapperDefinition[Channel]['requestMapper'] = RequestMapper<infer Payload> | undefined 이기 때문에 타입 분기 필요함
    // 타입 분기는 `extends` 키워드로 가능하며, `infer` 키워드로 타입에 대한 변수 선언이 가능함
    ...args: UserRequestMapperDefinition[Channel]['requestMapper'] extends RequestMapper<
      infer Payload
    >
      ? [payload: Payload]
      : []
  ) {
    this.doAsyncJobSafely(() => {
      const destination = this.requestDefinition[channel].channelMapper(
        ...channelMapperParams,
      );
      const body =
        args.length > 0
          ? this.requestDefinition[channel].requestMapper?.(args[0])
          : undefined;

      logger.debug('publish:', destination, body, channelMapperParams, args);

      // TODO: stomp-specific으로 분리
      this.stompClient.publish({
        destination,
        // undefined이면 안 가겠지?
        body,
      });
    });
  }

  public addOnConnectJob(job: () => void) {
    this.onConnectQueue.push(job);
  }

  public removeOnConnectJob(job: () => void) {
    this.onConnectQueue = this.onConnectQueue.filter((j) => j !== job);
  }

  // NOTE: channel 별 listener 들을 stompClient에 등록
  // 최초 connect 시점 이전에 subscribe하거나 re-connect 시 다시 subscribe 해야 하는 경우를 처리
  private subscribeWaitingSubscriptions() {
    if (!this.isReconnecting) {
      return;
    }

    logger.debug(
      'subscribeWaitingSubscriptions:',
      [...this.stompSingletonChannelSubscribers.keys()].join(','),
    );

    for (const [channelName, callListeners] of this
      .stompSingletonChannelSubscribers) {
      this.subscribeOnStompSafely(channelName as string, callListeners);
    }
  }

  private isSubscribedOnStomp(channelName: string) {
    return this.stompRawSubscriptionObjects.has(channelName);
  }

  private unsubscribeOnStomp(channelName: string) {
    this.stompRawSubscriptionObjects.get(channelName)?.unsubscribe();
    this.stompRawSubscriptionObjects.delete(channelName);
    this.stompSingletonChannelSubscribers.delete(channelName);
  }

  // NOTE: 웹소켓 connect 시점은 보장할 수 없는 환경이어서 분기 필요
  private subscribeOnStompSafely(
    channelName: string,
    callListeners: (message: IMessage) => void,
  ) {
    // NOTE: 해당 방어구문은 없어야 정상이긴 함
    if (this.stompSingletonChannelSubscribers.has(channelName)) {
      return;
    }

    logger.debug('subscribeOnStompSafely:', channelName);
    this.stompSingletonChannelSubscribers.set(channelName, callListeners);

    this.doAsyncJobSafely(() => {
      const subscription = this.stompClient.subscribe(
        channelName,
        callListeners,
      );
      this.stompRawSubscriptionObjects.set(channelName, subscription);
    });
  }

  // TODO: enqueueJob으로 개선
  private doAsyncJobSafely(job: () => void) {
    if (!this.isConnected) {
      this.connectWaitQueue.push(job);
    } else {
      job();
    }
  }

  // NOTE: 웹소켓 초기화 용도
  private intentionallyDisconnect() {
    this.stompClient.deactivate();
    this.isConnected = false;
    this.isConnecting = false;
    this.clearState();
  }

  private checkAndConnect() {
    if (!this.isConnected && !this.isConnecting) {
      this.isConnecting = true;
      this.stompClient.activate();
      console.log('checkAndConnect', this.isConnected, this.isConnecting);
    }
  }

  private clearState() {
    this.observersByChannel = new Map();
    this.connectWaitQueue = [];
    this.onConnectQueue = [];

    // stomp-specific
    this.stompRawSubscriptionObjects = new Map();
    this.stompSingletonChannelSubscribers = new Map();
  }
}
