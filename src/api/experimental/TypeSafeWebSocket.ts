type ResponseHandler<Payload> = (_payload: Payload) => void;

type ResponseHandlers = Record<string, ResponseHandler<unknown>>;

type ChannelConfig<Handlers extends ResponseHandlers> = (
  _handlers: Handlers,
) => void;

// 전체 Definition 타입
export type ResponseMapperDefinition = Record<
  string,
  ChannelConfig<ResponseHandlers>
>;

export class TypeSafeWebSocket<
  UserResponseMapperDefinition extends ResponseMapperDefinition,
> {
  private definition: UserResponseMapperDefinition;

  constructor(definition: UserResponseMapperDefinition) {
    this.definition = definition;
  }

  // unsubscribe만 반환하면 됨!
  public subscribe<Channel extends keyof UserResponseMapperDefinition>(
    channel: Channel,
    handlerConfig: Parameters<UserResponseMapperDefinition[Channel]>[0],
  ) {
    //do nothing!
    console.log(this.definition[channel](handlerConfig));
  }
}
