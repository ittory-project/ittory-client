import { Client, StompSubscription } from '@stomp/stompjs';

import { SessionLogger } from '../../utils';
import { createStompClient } from './createStompClient';

type ResponseHandler<Payload> = (_payload: Payload) => void;

type ResponseHandlers = Record<string, ResponseHandler<unknown>>;

type ChannelConfig<Handlers extends ResponseHandlers> = (
  _handlers: Handlers,
) => (_payload: unknown) => void;

// 전체 Definition 타입
export type ResponseMapperDefinition = Record<
  string,
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channelMapper: (..._args: any[]) => string;
    mapper: ChannelConfig<ResponseHandlers>;
  }
>;

const logger = new SessionLogger('websocket-infra');

export class TypeSafeWebSocket<
  UserResponseMapperDefinition extends ResponseMapperDefinition,
> {
  private definition: UserResponseMapperDefinition;
  private stompClient: Client;
  private subscriptions: Map<
    keyof UserResponseMapperDefinition,
    StompSubscription
  >;
  private channelListeners: Map<
    keyof UserResponseMapperDefinition,
    ((_message: unknown) => void)[]
  >;
  private isConnected = false;

  // NOTE: 연결 상태가 아닐 때 클라이언트 요청이 발생하는 경우 해당 큐에서 대기.
  // 연결 시 모든 큐에서 대기하던 작업을 실행하고 큐를 비움
  private connectWaitQueue: (() => void)[] = [];

  constructor(responseMapperDefinition: UserResponseMapperDefinition) {
    this.definition = responseMapperDefinition;
    this.subscriptions = new Map();
    this.channelListeners = new Map();
    this.connectWaitQueue = [];

    // stomp-specific
    this.stompClient = createStompClient();
    this.stompClient.onConnect = () => {
      this.connectWaitQueue.forEach((job) => job());
      this.connectWaitQueue = [];
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
      UserResponseMapperDefinition[Channel]['mapper']
    >[0],
  ) {
    let currentListener: ((_payload: unknown) => void) | null = null;
    const channelName = this.definition[channel].channelMapper(
      ...channelMapperParams,
    );
    logger.debug('channelName', channelName);

    // 아직 리스너 배열이 없으면 리스너 배열 생성
    const channelListeners = this.channelListeners.get(channelName) ?? [];
    this.channelListeners.set(channelName, channelListeners);

    // 리스너 배열에 리스너 추가
    currentListener = this.definition[channel]
      .mapper(handlerConfig)
      .bind(this.definition[channel]);
    channelListeners.push(currentListener);

    logger.debug('channelListeners', channelListeners, this.channelListeners);
    logger.debug('currentListener', currentListener);

    // 아직 구독 중이지 않으면 구독 필요
    if (!this.subscriptions.has(channelName)) {
      const callListeners = (message: unknown) => {
        this.channelListeners
          .get(channelName)
          ?.forEach((listener) => listener(message));
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

  private doAsyncJobSafely(job: () => void) {
    if (!this.isConnected) {
      this.connectWaitQueue.push(job);
    } else {
      job();
    }
  }
}
