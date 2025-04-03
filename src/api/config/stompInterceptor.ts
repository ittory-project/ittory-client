import { Client } from '@stomp/stompjs';
import { getJwt } from './setToken';

export const stompClient = (): Client => {
  const authorization = getJwt();
  if (!authorization) {
    throw new Error('Authorization is not set');
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

  client.onStompError = (frame) => {
    console.error('STOMP error:', frame.headers.message);
  };
  client.onDisconnect = () => {
    console.log('Disconnected from WebSocket');
  };

  return client;
};
