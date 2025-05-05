// 아예 별도의 파일에서 추론되는지 확인
import { useEffect } from 'react';

import { SessionLogger } from '../../utils';
import { getWebSocketApi } from './instance';

const logger = new SessionLogger('websocket-infra');

export const WebSocketUsageExample = () => {
  const webSocket = getWebSocketApi();

  useEffect(() => {
    const unsubscribe = webSocket.subscribe('letter', [3241], {
      exit: (payload) => logger.debug('exit:', payload),
      submit: (payload) => logger.debug('submit:', payload),
      timeout: (payload) => logger.debug('timeout:', payload),
    });
    logger.debug('subscribing useEffect', unsubscribe);

    webSocket.send('letter', [3241], {
      name: 'John',
      age: 20,
    });

    return () => {
      logger.debug('unsubscribing useEffect');
      unsubscribe();
    };
  }, []);

  return null;
};
