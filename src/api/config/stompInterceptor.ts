import { Client } from '@stomp/stompjs';
import { getJwt } from './setToken';

export const stompClient = (): Client => {
  const client = new Client({
    brokerURL: `${import.meta.env.VITE_SERVER_URL}/connection`,
    connectHeaders: {
      Authorization: `Bearer ${getJwt()}`,
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
