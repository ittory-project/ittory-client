type ResponseHandler<Payload> = (_payload: Payload) => void;

type ResponseHandlers = Record<string, ResponseHandler<unknown>>;

type ChannelConfig<Handlers extends ResponseHandlers> = (
  _handlers: Handlers,
) => void;

// 전체 Definition 타입
type DefinitionGuideline = Record<string, ChannelConfig<ResponseHandlers>>;

export class TypeSafeWebSocket<UserDefinition extends DefinitionGuideline> {
  private definition: UserDefinition;

  constructor(definition: UserDefinition) {
    this.definition = definition;
  }

  // unsubscribe만 반환하면 됨!
  public subscribe<Channel extends keyof UserDefinition>(
    channel: Channel,
    handlerConfig: Parameters<UserDefinition[Channel]>[0],
  ) {
    //do nothing!
    console.log(this.definition[channel](handlerConfig));
  }
}
