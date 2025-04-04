import { Client } from '@stomp/stompjs';
import { fetchNewAccessToken } from './tokenRefresh';
import { forceLogout } from './logout';
import { AccessTokenManager } from './accessTokenManager';

export const stompClient = (): Client => {
  const authorization = AccessTokenManager.getInstance().getAccessToken();
  if (!authorization) {
    throw new Error('WebSocket 인증에 필요한 엑세스 토큰이 없습니다.');
  }

  const client = new Client({
    brokerURL: `${import.meta.env.VITE_SERVER_URL}/connection`,
    connectHeaders: {
      Authorization: authorization,
    },
    debug: (str) => {
      console.log(str);
    },
    // 기본 값을 명시적으로 사용
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  // FIXME: 토큰 리프레시가 안 되는 경우가 있는데 정확한 원인 분석이 어려워 확인 필요
  client.onStompError = async (frame) => {
    // 인증 관련 오류인 경우 토큰 갱신 시도
    if (frame.headers.message?.toLowerCase().includes('unauthorized')) {
      try {
        await fetchNewAccessToken();

        if (client.connected) {
          client.deactivate();
        }
        client.activate();
      } catch (error) {
        console.error('토큰 리프레시에 실패했습니다:', error);
        forceLogout();
      }
    } else {
      console.error('STOMP error:', frame.headers.message);
    }
  };

  client.onDisconnect = () => {
    console.log('Disconnected from WebSocket');
  };

  return client;
};
