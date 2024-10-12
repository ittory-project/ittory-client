import { stompClient } from "../config/stompInterceptor";

export const enterComponent = (letterId: number) => {

  const client = stompClient();

  client.onConnect = () => {
    console.log('WebSocket connected');

    client.subscribe(`/topic/letter/1`, (message) => {
      console.log('Subscribed to /topic/letter/' + letterId);
      const body = JSON.parse(message.body);
      console.log('Received message:', body);
    });

    client.publish({
      destination: `/ws/letter/enter/1`,
      body: JSON.stringify({ nickname: "준커" }),
    });    
  };
  client.onStompError = (frame) => {
    console.error('STOMP error:', frame.headers.message);
  };
  client.onDisconnect = () => {
    console.log('Disconnected from WebSocket');
  };

  client.activate();
};
