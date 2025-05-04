import { TypeSafeWebSocket } from './TypeSafeWebSocket';

// channel로 전달되는 raw response를 각 response로 변환하는 과정은 사용자가 직접 정의해야 함
export const userDefinition = {
  letter: (responseTypes: {
    exit?: (_payload: string) => void;
    submit?: (_payload: number) => void;
    timeout?: (_payload: boolean) => void;
  }) => {
    // todo
    if (Math.random() > 0.5) {
      responseTypes.exit?.('exit');
    } else if (Math.random() > 0.3) {
      responseTypes.submit?.(1);
    } else {
      responseTypes.timeout?.(true);
    }
  },
};

export const websocketApi = new TypeSafeWebSocket(userDefinition);
