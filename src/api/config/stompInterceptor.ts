import { Client } from '@stomp/stompjs';
import { forceLogout } from './logout';
import { accessTokenRepository } from './AccessTokenRepository';

export const stompClient = (): Client => {
  const authorization = accessTokenRepository.get();
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
  });

  client.onStompError = async (frame) => {
    if (frame.headers.message?.toLowerCase().includes('unauthorized')) {
      try {
        await accessTokenRepository.refresh();
        client.connectHeaders.Authorization = accessTokenRepository.get();

        if (client.connected) {
          client.deactivate();
        }
        client.activate();
      } catch (error) {
        console.error('WebSocket 요청 중 토큰 갱신에 실패:', error);
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
