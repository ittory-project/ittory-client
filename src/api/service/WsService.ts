import { stompClient } from "../config/stompInterceptor";
import { WsEnterResponse } from "../model/WsModel";

// 편지 입장 API
// param: 편지 ID, 설정할 유저 닉네임
// response: WsEnterResponse - 접속할 유저 정보
export const enterLetterWs = (letterId: number, nickname: string) => {
  const client = stompClient();

  client.onConnect = () => {
    // subscribe - 정보 수신
    // 메시지가 string 형태로 수신됨 -> json 형태로 파싱해서 사용
    client.subscribe(`/topic/letter/${letterId}`, (message) => {
      const response: WsEnterResponse = JSON.parse(message.body);
      console.log('Received message:', response);
    });  
    // publish - 정보 전송
    // json 형식의 정보를 string으로 변환해서 정보 전송
    client.publish({
      destination: `/ws/letter/enter/${letterId}`,
      body: JSON.stringify({ 
        nickname: nickname
      }),
    });  
  };

  client.activate();
};

// 편지 작성(조회) API
// param: 편지 ID, 편지 내용
// response: WsEnterResponse - 접속할 유저 정보
export const writeLetterWs = (letterId: number, sequence: number, content: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const client = stompClient();

    client.onConnect = () => {
      client.subscribe(`/topic/letter/${letterId}`, (message) => {
        const response = JSON.parse(message.body);
        console.log('Received message:', response);
        if (response && response.elementId) { 
          resolve();
        } else {
          reject(new Error("작성 실패"));
        }
      });

      client.publish({
        destination: `/ws/letter/${letterId}/elements`,
        body: JSON.stringify({ sequence, content }),
      });
    };

    client.onStompError = (frame) => {
      console.error("Broker reported error: ", frame.headers["message"]);
      reject(new Error("연결 오류"));
    };

    client.activate();
  });
};


// 편지 퇴장 API
// param: 편지 ID
// response: WsEnterResponse - 접속할 유저 정보
export const quitLetterWs = (letterId: number) => {
  const client = stompClient();

  client.onConnect = () => {
    client.subscribe(`/topic/letter/${letterId}`, (message) => {
      const response = JSON.parse(message.body);
      console.log('Received message:', response);
    });  
    client.publish({
      destination: `/ws/letter/exit/${letterId}`,
    });  
  };

  client.activate();
};