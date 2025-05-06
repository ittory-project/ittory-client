import { Client, IMessage, StompSubscription } from '@stomp/stompjs';

import { SessionLogger } from '../../utils';
import { createStompClient } from './createStompClient';

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

export class TypeSafeWebSocket<
  UserRequestMapperDefinition extends RequestMapperDefinition,
  UserResponseMapperDefinition extends ResponseMapperDefinition,
> {
  private requestDefinition: UserRequestMapperDefinition;
  private responseDefinition: UserResponseMapperDefinition;
  private stompClient: Client;
  private subscriptions: Map<
    keyof UserResponseMapperDefinition,
    StompSubscription
  >;
  private channelListeners: Map<
    keyof UserResponseMapperDefinition,
    ResponseHandler<string>[]
  >;
  private isConnected = false;

  // NOTE: 연결 상태가 아닐 때 클라이언트 요청이 발생하는 경우 해당 큐에서 대기.
  // 연결 시 모든 큐에서 대기하던 작업을 실행하고 큐를 비움
  private connectWaitQueue: (() => void)[] = [];

  constructor(
    requestMapperDefinition: UserRequestMapperDefinition,
    responseMapperDefinition: UserResponseMapperDefinition,
  ) {
    this.requestDefinition = requestMapperDefinition;
    this.responseDefinition = responseMapperDefinition;
    this.subscriptions = new Map();
    this.channelListeners = new Map();
    this.connectWaitQueue = [];

    // stomp-specific
    this.stompClient = createStompClient();
    this.stompClient.onConnect = () => {
      this.connectWaitQueue.forEach((job) => job());
      this.connectWaitQueue = [];
      this.isConnected = true;
    };
    this.stompClient.onDisconnect = () => {
      this.isConnected = false;
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
    let currentListener: ((_payload: string) => void) | null = null;
    const channelName = this.responseDefinition[channel].channelMapper(
      ...channelMapperParams,
    );
    logger.debug('channelName', channelName);

    // 아직 리스너 배열이 없으면 리스너 배열 생성
    const channelListeners = this.channelListeners.get(channelName) ?? [];
    this.channelListeners.set(channelName, channelListeners);

    // 리스너 배열에 리스너 추가
    currentListener = this.responseDefinition[channel]
      .responseMapper(handlerConfig)
      .bind(this.responseDefinition[channel]);
    channelListeners.push(currentListener);

    logger.debug('channelListeners', channelListeners, this.channelListeners);
    logger.debug('currentListener', currentListener);

    // 아직 구독 중이지 않으면 구독 필요
    if (!this.subscriptions.has(channelName)) {
      // FIXME: stomp-specific && 실제로 string으로 올텐데 왜 IMessage 타입인지 확인 필요
      const callListeners = (message: IMessage) => {
        this.channelListeners
          .get(channelName)
          ?.forEach((listener) => listener(message.body));
      };

      this.doAsyncJobSafely(() => {
        const subscription = this.stompClient.subscribe(
          channelName,
          callListeners,
        );
        this.subscriptions.set(channelName, subscription);
      });
    }

    // 모든 listeners가 없으면 구독도 종료
    return () => {
      logger.debug('unsubscribing', channelName);
      let channelListeners = this.channelListeners.get(channelName);
      if (!channelListeners) {
        throw new Error('channelListeners not found - it should never happen');
      }
      channelListeners = channelListeners.filter(
        (listener) => listener !== currentListener,
      );

      if (channelListeners.length === 0) {
        logger.debug('no listeners left, unsubscribing', channelName);
        this.channelListeners.delete(channelName);
        this.subscriptions.get(channelName)?.unsubscribe();
        this.subscriptions.delete(channelName);
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

  private doAsyncJobSafely(job: () => void) {
    if (!this.isConnected) {
      this.connectWaitQueue.push(job);
    } else {
      job();
    }
  }
}
