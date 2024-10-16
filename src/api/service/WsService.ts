import { stompClient } from "../config/stompInterceptor";
import { WsEnterResponse } from "../model/WsModel";

// 편지 생성 API
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
