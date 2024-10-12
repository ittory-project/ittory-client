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
    reconnectDelay: 5000, 
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  return client;
};
