import { Client } from '@stomp/stompjs';

import { SessionLogger } from '../../../utils/SessionLogger';
import { accessTokenRepository } from '../../config/AccessTokenRepository';
import { WEBSOCKET_CONFIG } from '../../config/constants';
import { forceLogout } from '../../config/logout';

const logger = new SessionLogger('websocket');

export const createStompClient = (): Client => {
  const authorization = accessTokenRepository.get();
  if (!authorization) {
    throw new Error(`WebSocket 인증에 필요한 엑세스 토큰이 없습니다.`);
  }

  const client = new Client({
    brokerURL: `${import.meta.env.VITE_SERVER_URL}/connection`,
    connectHeaders: {
      Authorization: authorization,
    },
    debug: logger.debug.bind(logger),
    // NOTE: 토큰 갱신 시 기본값인 5000ms는 너무 길어서, 500ms 대기 후 재연결
    reconnectDelay: WEBSOCKET_CONFIG.RECONNECT_DELAY,
    logRawCommunication: true,
    heartbeatIncoming: WEBSOCKET_CONFIG.HEARTBEAT_INCOMING,
    heartbeatOutgoing: WEBSOCKET_CONFIG.HEARTBEAT_OUTGOING,
  });

  client.onUnhandledFrame = (frame) => {
    logger.error('[onUnhandledFrame] ', frame);
  };

  client.onUnhandledMessage = (message) => {
    logger.error('[onUnhandledMessage] ', message);
  };

  client.onUnhandledReceipt = (receipt) => {
    logger.error('[onUnhandledReceipt] ', receipt);
  };

  client.onWebSocketError = (error) => {
    logger.error('[onWebSocketError] ', error);
  };

  client.onStompError = async (frame) => {
    if (frame.headers.message?.toLowerCase().includes('unauthorized')) {
      try {
        await accessTokenRepository.refresh();
        const authorization = accessTokenRepository.get();
        if (authorization) {
          client.connectHeaders.Authorization = authorization;
        }

        if (client.connected) {
          client.deactivate();
        }
        client.activate();
      } catch (error) {
        logger.error('WebSocket 요청 중 토큰 갱신에 실패:', error);
        forceLogout();
      }
    } else {
      logger.error('STOMP error:', frame.headers.message);
    }
  };

  return client;
};
