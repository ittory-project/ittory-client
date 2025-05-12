import { Client, IMessage, StompSubscription } from '@stomp/stompjs';

import { SessionLogger } from '../../utils';
import { createStompClient } from './stompjs';

type RequestMapper<Payload> = (_payload: Payload) => string;

type ResponseHandler<Payload> = (_payload: Payload) => void;

type ResponseHandlers = Record<string, ResponseHandler<string>>;

type ChannelConfig<Handlers extends ResponseHandlers> = (
  _handlers: Handlers,
) => (_payload: string) => void;

// 전체 Definition 타입
// 되게 단순함 이거는 channelMapper랑 payloadMapper만 있으면 됨
export type RequestMapperDefinition = Record<
  string,
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channelMapper: (..._args: any[]) => string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestMapper?: RequestMapper<any>;
  }
>;

export type ResponseMapperDefinition = Record<
  string,
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channelMapper: (..._args: any[]) => string;
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

  // NOTE: 연결 상태가 아닐 때 클라이언트 요청이 발생하는 경우 해당 큐에서 대기.
  // 연결 시 모든 큐에서 대기하던 작업을 실행하고 큐를 비움
  private connectWaitQueue: (() => void)[] = [];

  // stomp-specific
  private stompClient: Client;
  private stompSubscriptions: Map<
    keyof UserResponseMapperDefinition,
    StompSubscription
  >;
  private stompSubscribers: Map<
    keyof UserResponseMapperDefinition,
    (_message: IMessage) => void
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
    this.stompSubscriptions = new Map();
    this.stompSubscribers = new Map();

    // stomp-client specific
    this.stompClient = createStompClient();
    this.stompClient.onConnect = (iframe) => {
      logger.debug('onConnect', iframe);

      this.connectWaitQueue.forEach((job) => job());
      this.connectWaitQueue = [];
      this.isConnected = true;

      this.subscribeAllSubscriptions();
    };
    this.stompClient.onDisconnect = (iframe) => {
      logger.debug('onDisconnect', iframe); //호출되지 않음
      this.isConnected = false;
    };
    this.stompClient.onWebSocketClose = (event) => {
      logger.debug('onWebSocketClose', event);
    };
    this.stompClient.activate();
  }

  // NOTE: activate 이전에 호출됨
  // NOTE: keyof를 쓰면 아무리 string key로 설정했더라도 항상 number|string|symbol 타입으로 추론되므로 & string을 추가
  public subscribe<Channel extends keyof UserResponseMapperDefinition & string>(
    channel: Channel,
    channelMapperParams: Parameters<
      UserResponseMapperDefinition[Channel]['channelMapper']
    >,
    handlerConfig: Parameters<
      UserResponseMapperDefinition[Channel]['responseMapper']
    >[0],
  ) {
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

    logger.debug(
      'subscribe - oberversForChannel',
      oberversForChannel,
      this.observersByChannel,
    );
    logger.debug(
      'subscribe - newChannelObserver: ',
      newChannelObserver,
      ', oberversForChannel: ',
      oberversForChannel,
    );

    // 아직 구독 중이지 않으면 구독 필요
    if (!this.stompSubscriptions.has(channelName)) {
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

      // 이미 연결되어 있는 경우 직접 subscribe 필요함
      if (this.isConnected) {
        const subscription = this.stompClient.subscribe(
          channelName as string,
          callListeners,
        );
        this.stompSubscriptions.set(channelName, subscription);
      }

      this.stompSubscribers.set(channelName, callListeners);
    } else {
      logger.debug('channel is already subscribed', channelName);
    }

    // 모든 listeners가 없으면 구독도 종료
    return () => {
      // 현재 시점의 최신 값을 조회해야 함.
      const oberversForChannel = this.observersByChannel.get(channelName);
      if (!oberversForChannel) {
        throw new Error(
          'oberversForChannel not found - it should never happen',
        );
      }

      this.observersByChannel.set(
        channelName,
        oberversForChannel.filter(
          (listener) => listener !== newChannelObserver,
        ),
      );

      logger.debug(
        'unsubscribing',
        channelName,
        ', observer: ',
        newChannelObserver,
        ', after unsub:',
        this.observersByChannel.get(channelName),
      );

      // 이거 실수했었네.
      if (this.observersByChannel.get(channelName)?.length === 0) {
        this.observersByChannel.delete(channelName);
        this.stompSubscriptions.get(channelName)?.unsubscribe();
        this.stompSubscriptions.delete(channelName);
        this.stompSubscribers.delete(channelName); // 이거 빠졌었네
        logger.debug(
          'no listeners left, unsubscribing',
          channelName,
          ', this.observersByChannel:',
          this.observersByChannel,
          ', this.stompSubscriptions:',
          this.stompSubscriptions,
        );
      } else {
        logger.debug(
          'listeners left, not unsubscribing',
          channelName,
          oberversForChannel,
        );
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

  // NOTE: channel 별 listener 들을 stompClient에 등록
  // 최초 connect 시점 이전에 subscribe하거나 re-connect 시 다시 subscribe 해야 하는 경우를 처리
  private subscribeAllSubscriptions() {
    this.stompSubscriptions.clear();

    for (const [channelName, callListeners] of this.stompSubscribers) {
      const subscription = this.stompClient.subscribe(
        channelName as string,
        callListeners,
      );
      this.stompSubscriptions.set(channelName, subscription);
    }

    logger.debug('subscribeAll - stompSubscribers:', this.stompSubscribers);
  }

  // TODO: enqueueJob으로 개선
  private doAsyncJobSafely(job: () => void) {
    if (!this.isConnected) {
      this.connectWaitQueue.push(job);
    } else {
      job();
    }
  }
}
