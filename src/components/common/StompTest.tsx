import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getJwt } from '../../api/config/setToken';

const StompTest: React.FC = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  
  useEffect(() => {
    // 웹소켓 연결을 위한 클라이언트 설정
    const stompClient = new Client({
      // SockJS를 통해 웹소켓 연결
      webSocketFactory: () => new SockJS(import.meta.env.VITE_SERVER_URL),
      connectHeaders: {
        Authorization: 'Bearer ' + getJwt(),  // 토큰을 여기에 넣어주세요
      },
      debug: (str) => {
        console.log(str);  // 디버그 로그 출력
      },
      onConnect: () => {
        console.log('Connected to WebSocket');
        
        // 구독 설정
        stompClient.subscribe('/topic/letter/1', (message) => {
          const body = JSON.parse(message.body);
          console.log('Received message:', body);
          setMessages((prevMessages) => [...prevMessages, body]);
        });

        // 메시지 전송 예시
        stompClient.publish({
          destination: '/ws/letter/enter/1',
          body: JSON.stringify({ nickname: '준커' }),  // 보낼 데이터
        });
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
      },
    });

    stompClient.activate();
    setClient(stompClient);

    // 컴포넌트 언마운트 시 클라이언트 연결 해제
    return () => {
      if (stompClient) stompClient.deactivate();
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Messages</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{JSON.stringify(msg)}</li>
        ))}
      </ul>
    </div>
  );
};

export default StompTest;
