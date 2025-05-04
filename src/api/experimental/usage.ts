// 아예 별도의 파일에서 추론되는지 확인
import { useEffect } from 'react';

import { TypeSafeWebSocket } from './TypeSafeWebSocket';
import { userResponseMapperDefinition } from './instance';

export const WebSocketUsageExample = () => {
  useEffect(() => {
    let unsubscribe: () => void;
    setTimeout(() => {
      const websocketApi = new TypeSafeWebSocket(userResponseMapperDefinition);
      setTimeout(() => {
        unsubscribe = websocketApi.subscribe('letter', [3239], {
          exit: (payload) => console.log('exit:', payload),
          submit: (payload) => console.log('submit:', payload),
          timeout: (payload) => console.log('timeout:', payload),
        });
      }, 1000);
    }, 1000);

    return () => {
      unsubscribe?.();
    };
  }, []);

  return null;
};
