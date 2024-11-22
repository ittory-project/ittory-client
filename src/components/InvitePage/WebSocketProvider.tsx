import React, { useEffect, useState, useRef } from "react";
import { enterLetterWs } from "../../api/service/WsService"; // `enterLetterWs` import
import { stompClient } from "../../api/config/stompInterceptor";
import { WsExitResponse } from "../../api/model/WsModel";
import { getMyPage } from "../../api/service/MemberService";

export const WebSocketProvider = ({
  children,
  letterId,
}: {
  children: React.ReactNode;
  letterId: number;
}) => {
  const [exitMessage, setExitMessage] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const wsInitialized = useRef(false);

  useEffect(() => {
    // name이 업데이트 된 후 WebSocket 연결
    const fetchMydata = async () => {
      try {
        const mydata = await getMyPage();
        setName(mydata.name);
      } catch (err) {
        console.error("Error fetching mydata:", err);
      }
    };

    fetchMydata();
  }, []); // name을 한번만 가져오기 위해 빈 배열 사용

  // WebSocket 연결 설정: name과 letterId가 있을 때 한 번만 실행
  useEffect(() => {
    if (name && letterId && !wsInitialized.current) {
      // 웹소켓 연결 초기화가 되어 있지 않으면 연결 시도
      enterLetterWs(letterId, name);
      wsInitialized.current = true;
    }
  }, [name, letterId]);

  // 퇴장 이벤트 수신
  useEffect(() => {
    const client = stompClient();

    client.onConnect = () => {
      client.subscribe(`/topic/letter/${letterId}`, (message) => {
        const response: WsExitResponse = JSON.parse(message.body);
        console.log("Received exit message:", response);

        // 퇴장 메시지 처리
        if (response.action === "EXIT") {
          setExitMessage(`${response.nickname} has exited.`); // 퇴장 알림 설정
          alert(`${response.nickname} has exited.`); // 브라우저 알림으로 표시
        }
      });
    };

    client.activate(); // WebSocket 연결 활성화

    // WebSocket 연결 해제
    return () => {
      client.deactivate();
    };
  }, [exitMessage]); // exitMessage가 변경될 때마다 실행

  return (
    <>
      {React.cloneElement(children as React.ReactElement, {
        exit: exitMessage === "EXIT",
        setExitMessage,
      })}
    </>
  );
};

// 편지 퇴장 API (exitLetterWs)
export const exitLetterWs = (
  letterId: number,
  nickname: string,
  setExitMessage: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const client = stompClient();

  client.onConnect = () => {
    // subscribe - 퇴장 메시지를 수신
    client.subscribe(`/topic/letter/${letterId}`, (message) => {
      console.log(message);
      const response: WsExitResponse = JSON.parse(message.body);
      console.log("Received message:", response);
      // 퇴장 메시지 처리
      if (response.action === "EXIT") {
        setExitMessage("EXIT");
        client.deactivate(); // 메시지 수신
      }
    });

    // publish - 퇴장 정보 전송
    client.publish({
      destination: `/ws/letter/exit/${letterId}`,
    });
  };

  client.activate();
};
