import {
  ResponseMapperDefinition,
  TypeSafeWebSocket,
} from './TypeSafeWebSocket';

// channel로 전달되는 raw response를 각 response로 변환하는 과정은 사용자가 직접 정의해야 함
// Mapper + Switch-Case 구현 파트
// TODO: 사용자가 (채널, 이벤트, 페이로드 타입)을 먼저 정의해놓고 제네릭으로 전달하면 자동 완성이 좀 될텐데 지금은 아예 안 되긴 함
// 여기서 타입 힌트를 줘버리면 문제가 됨. 대신 satisfies를 쓰면 자동 완성은 되면서 타입 추론이 안 되는 문제도 해결됨
export const userResponseMapperDefinition = {
  letter: {
    channelMapper: (letterId: number) => `/topic/letter/${letterId}`,
    mapper:
      (handlers: {
        exit?: (_payload: string) => void;
        submit?: (_payload: number) => void;
        timeout?: (_payload: boolean) => void;
      }) =>
      (payload: unknown) => {
        const _processed = JSON.parse(payload as string);
        if (Math.random() > 0.5) {
          handlers.exit?.('exit');
        } else if (Math.random() > 0.3) {
          handlers.submit?.(1);
        } else {
          handlers.timeout?.(true);
        }
      },
  },
} satisfies ResponseMapperDefinition;

let instance: TypeSafeWebSocket<typeof userResponseMapperDefinition> | null =
  null;

export const getWebSocketApi = () => {
  if (!instance) {
    instance = new TypeSafeWebSocket(userResponseMapperDefinition);
  }
  return instance;
};
