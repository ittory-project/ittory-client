type Deserializer<Payload> = (_payload: unknown) => Payload;

// 사용자에게 제공할 '가이드라인'
// 이 타입을 그대로 쓰면 타입 추론이 아예 안 되기 때문에, 제네릭으로 인자를 받아 실제 타입을 추론해야 함.
export type InputType = {
  [channel: string]: {
    [event: string]: Deserializer<unknown>;
  };
};

export class TypeSafeWebSocket<Definition extends InputType> {
  private definition: Definition;

  constructor(definition: Definition) {
    this.definition = definition;
  }

  public subscribe<Channel extends keyof Definition>(
    channel: Channel,
  ): Definition[Channel] {
    return this.definition[channel];
  }
}
