import { Client } from '@stomp/stompjs';

import { createStompClient } from './createStompClient';

type ResponseHandler<Payload> = (_payload: Payload) => void;

type ResponseHandlers = Record<string, ResponseHandler<unknown>>;

type ChannelConfig<Handlers extends ResponseHandlers> = (
  _handlers: Handlers,
) => (_payload: unknown) => void;

// 전체 Definition 타입
export type ResponseMapperDefinition = Record<
  string,
  ChannelConfig<ResponseHandlers>
>;

export class TypeSafeWebSocket<
  UserResponseMapperDefinition extends ResponseMapperDefinition,
> {
  private definition: UserResponseMapperDefinition;
  private stompClient: Client;

  constructor(responseMapperDefinition: UserResponseMapperDefinition) {
    this.definition = responseMapperDefinition;
    this.stompClient = createStompClient();
  }

  // unsubscribe만 반환하면 됨!
  // keyof를 쓰면 아무리 string key로 설정했더라도 항상 number|string|symbol 타입으로 추론되므로 & string을 추가
  public subscribe<Channel extends keyof UserResponseMapperDefinition & string>(
    channel: Channel,
    handlerConfig: Parameters<UserResponseMapperDefinition[Channel]>[0],
  ) {
    //do nothing!
    this.stompClient.subscribe(channel, (message) => {
      this.definition[channel](handlerConfig)(message);
    });
  }
}
