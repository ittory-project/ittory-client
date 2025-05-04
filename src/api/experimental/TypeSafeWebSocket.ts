import { Client, StompSubscription } from '@stomp/stompjs';

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

  constructor(responseMapperDefinition: UserResponseMapperDefinition) {
    this.definition = responseMapperDefinition;
    this.stompClient = createStompClient();
    this.subscriptions = new Map();
    this.channelListeners = new Map();

    // FIXME: 현재는 Auth 토큰 생성 등 때문에 타이밍 맞춰서 생성해야 함
    this.stompClient.activate();
  }

  // keyof를 쓰면 아무리 string key로 설정했더라도 항상 number|string|symbol 타입으로 추론되므로 & string을 추가
  public subscribe<Channel extends keyof UserResponseMapperDefinition & string>(
    channel: Channel,
    channelMapperParams: Parameters<
      UserResponseMapperDefinition[Channel]['channelMapper']
    >,
    handlerConfig: Parameters<
      UserResponseMapperDefinition[Channel]['mapper']
    >[0],
  ) {
    const channelName = this.definition[channel].channelMapper(
      ...channelMapperParams,
    );

    // 아직 리스너 배열이 없으면 리스너 배열 생성
    const channelListeners = this.channelListeners.get(channelName) ?? [];
    if (!channelListeners) {
      this.channelListeners.set(channelName, channelListeners);
    }

    // 리스너 배열에 리스너 추가
    const currentListener = this.definition[channel]
      .mapper(handlerConfig)
      .bind(this.definition[channel]);
    channelListeners.push(currentListener);

    // 아직 구독 중이지 않으면 구독 필요
    if (!this.subscriptions.has(channel)) {
      const callListeners = (message: unknown) => {
        this.channelListeners
          .get(channel)
          ?.forEach((listener) => listener(message));
      };
      const subscription = this.stompClient.subscribe(channel, callListeners);
      this.subscriptions.set(channel, subscription);
    }

    // 모든 listeners가 없으면 구독도 종료
    return () => {
      const channelListeners = this.channelListeners.get(channel);
      if (!channelListeners) {
        return;
      }
      channelListeners.filter((listener) => listener !== currentListener);
      if (channelListeners.length === 0) {
        this.subscriptions.get(channel)?.unsubscribe();
        this.subscriptions.delete(channel);
      }
    };
  }
}
