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
  const [exitName, setexitName] = useState<string | null>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const fetchMydata = async () => {
      try {
        const mydata = await getMyPage();
        setName(mydata.name);
      } catch (err) {
        console.error("Error fetching mydata:", err);
      }
    };

    fetchMydata();
  }, []);

  // WebSocket 연결 설정
  useEffect(() => {
    if (name && letterId) {
      enterLetterWs(letterId, name, setexitName);
    }
  }, [name, letterId]);

  return (
    <>
      {React.cloneElement(children as React.ReactElement, {
        exitName,
        setexitName,
      })}
    </>
  );
};
