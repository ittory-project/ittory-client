import {
  ResponseMapperDefinition,
  TypeSafeWebSocket,
} from './TypeSafeWebSocket';

// channel로 전달되는 raw response를 각 response로 변환하는 과정은 사용자가 직접 정의해야 함
// Mapper + Switch-Case 구현 파트
// TODO: 사용자가 (채널, 이벤트, 페이로드 타입)을 먼저 정의해놓고 제네릭으로 전달하면 자동 완성이 좀 될텐데 지금은 아예 안 되긴 함
export const userResponseMapperDefinition: ResponseMapperDefinition = {
  letter: (handlers: {
    exit?: (_payload: string) => void;
    submit?: (_payload: number) => void;
    timeout?: (_payload: boolean) => void;
  }) => {
    if (Math.random() > 0.5) {
      handlers.exit?.('exit');
    } else if (Math.random() > 0.3) {
      handlers.submit?.(1);
    } else {
      handlers.timeout?.(true);
    }
  },
};

export const websocketApi = new TypeSafeWebSocket(userResponseMapperDefinition);
