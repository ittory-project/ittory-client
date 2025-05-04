// 아예 별도의 파일에서 추론되는지 확인
import { useEffect } from 'react';

import { getWebSocketApi } from './instance';

export const WebSocketUsageExample = () => {
  const webSocket = getWebSocketApi();

  useEffect(() => {
    const unsubscribe = webSocket.subscribe('letter', [3241], {
      exit: (payload) => console.log('exit:', payload),
      submit: (payload) => console.log('submit:', payload),
      timeout: (payload) => console.log('timeout:', payload),
    });
    console.log('subscribing useEffect', unsubscribe);

    return () => {
      console.log('unsubscribing useEffect');
      unsubscribe();
    };
  }, []);

  return null;
};
