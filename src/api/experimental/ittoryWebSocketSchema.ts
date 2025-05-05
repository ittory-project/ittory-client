import {
  RequestMapperDefinition,
  ResponseMapperDefinition,
} from './TypeSafeWebSocket';

export const ittoryRequestMapperDefinition = {
  letter: {
    channelMapper: (letterId: number) => `/topic/letter/${letterId}`,
    requestMapper: (payload: { name: string; age: number }) => {
      return JSON.stringify(payload);
    },
  },
  start: {
    channelMapper: (letterId: number) => `/topic/letter/${letterId}/start`,
    // requestMapper를 정의하지 않을 수도 있게. 사용하지 않기 때문.
  },
} satisfies RequestMapperDefinition;

// channel로 전달되는 raw response를 각 response로 변환하는 과정은 사용자가 직접 정의해야 함
// Mapper + Switch-Case 구현 파트
// TODO: 사용자가 (채널, 이벤트, 페이로드 타입)을 먼저 정의해놓고 제네릭으로 전달하면 자동 완성이 좀 될텐데 지금은 아예 안 되긴 함
// 여기서 타입 힌트를 줘버리면 문제가 됨. 대신 satisfies를 쓰면 자동 완성은 되면서 타입 추론이 안 되는 문제도 해결됨
export const userResponseMapperDefinition = {
  letter: {
    channelMapper: (letterId: number) => `/topic/letter/${letterId}`,
    responseMapper:
      (handlers: {
        exit?: (_payload: string) => void;
        submit?: (_payload: number) => void;
        timeout?: (_payload: boolean) => void;
      }) =>
      (payload) => {
        const parsedPayload = JSON.parse(payload);
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
