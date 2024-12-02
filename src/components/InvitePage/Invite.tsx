import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { HostUser } from "./HostUser";
import { Member } from "./Member";
import { getParticipants } from "../../api/service/LetterService";
import { getMyPage } from "../../api/service/MemberService";
import { stompClient } from "../../api/config/stompInterceptor";
import { WsExitResponse, WsEnterResponse } from "../../api/model/WsModel";
import { postEnter } from "../../api/service/LetterService";
import { postNickname } from "../../api/service/ParticipantService";

export interface Participants {
  sequence: number;
  memberId: number;
  nickname: string;
  imageUrl: string;
}

//재방문유저 여부
export const Invite = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const guideOpen = location.state.guideOpen;
  const getletterId = location.state.letterId;

  const [exitAlert, setExitAlert] = useState<string | null>(null);
  const [hostAlert, setHostAlert] = useState<string | null>(null);
  const [memberIndex, setMemberIndex] = useState<number>(-1);
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [prevParticipants, setPrevParticipants] = useState<Participants[]>([]);
  const [userId, setUserId] = useState<number>(0);
  const [letterId, setLetterId] = useState<number>(getletterId);
  const [name, setName] = useState<string>("");
  const [exitName, setExitName] = useState<string>("");
  const [viewDelete, setViewDelete] = useState<boolean>(false);

  const fetchParticipants = async () => {
    try {
      const data = await getParticipants(letterId);

      if (userId) {
        // 방장 여부 체크
        if (data[0].memberId === userId) {
          setMemberIndex(0);
        } else {
          setMemberIndex(1);
        }
      }
      setParticipants(data);

      if (participants) {
        setPrevParticipants(participants); //이전 멤버들
      }

      if (prevParticipants.length > 0 && data.length > 0) {
        const prevHost = prevParticipants[0];
        const currentHost = data[0];

        if (prevHost.memberId !== currentHost.memberId) {
          setExitAlert(`방장 '${prevHost.nickname}'님이 퇴장했어요`);
          setHostAlert(
            `참여한 순서대로 '${data[0].nickname}'님이 방장이 되었어요`
          );
        } else {
          setExitAlert(`'${prevHost.nickname}'님이 퇴장했어요`);
        }
      }
      setPrevParticipants(data);
    } catch (err) {
      console.error("Error fetching participants:", err);
    }
  };

  useEffect(() => {
    const fetchMydata = async () => {
      try {
        const mydata = await getMyPage();
        setUserId(mydata.memberId);
        setName(mydata.name);
      } catch (err) {
        console.error("Error fetching mydata:", err);
      }
    };

    fetchMydata();
    localStorage.removeItem("letterId");
    console.log("start");
  }, []); // 초기화

  useEffect(() => {
    fetchParticipants();
    console.log("start");
  }, [userId]); // 초기화

  /*주기적으로 참가자 갱신
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("갱신");
      fetchParticipants(); // 주기적으로 참가자 데이터 갱신
    }, 10000); // 10초마다 실행

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 정리
  }, []);*/

  useEffect(() => {
    const client = stompClient();

    client.onConnect = () => {
      console.log("WebSocket connected");

      // WebSocket 구독
      client.subscribe(`/topic/letter/${letterId}`, (message) => {
        console.log("Received message:", message);
        try {
          const response: WsEnterResponse | WsExitResponse = JSON.parse(
            message.body
          );
          console.log(response);

          // 퇴장 메시지 처리
          if (response.action === "EXIT") {
            setExitName(response.nickname);
            if (response.participantId == prevParticipants[0].memberId) {
              setExitAlert(`방장 '${exitName}'님이 퇴장했어요`);
              setHostAlert(`참여한 순서대로 '${exitName}'님이 방장이 되었어요`);
            } else {
              setExitAlert(`'${exitName}'님이 퇴장했어요`);
            }
            fetchParticipants();
          } else if (response.action === "END") {
            setViewDelete(true);
          } else if (response.action === "START") {
            navigate("/Connection", {
              state: {
                letterId: letterId,
              },
            });
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      });

      // 서버에 입장 정보 전송
      client.publish({
        destination: `/ws/letter/enter/${letterId}`,
        body: JSON.stringify({ nickname: name }),
      });
    };

    client.activate();
  }, [userId]);

  //퇴장 알림
  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setExitAlert(null);
      if (exitName) {
        setExitName("");
      }
    }, 5000);

    return () => clearTimeout(exitTimer);
  }, [exitAlert]);

  //방장 바뀜 알림
  useEffect(() => {
    const hostTimer = setTimeout(() => {
      setHostAlert(null);
    }, 10000);

    return () => clearTimeout(hostTimer);
  }, [hostAlert]);

  return (
    <BackGround>
      {exitName && <ExitAlert>{exitAlert}</ExitAlert>}
      {hostAlert && <HostAlert>{hostAlert}</HostAlert>}
      {memberIndex == 0 && (
        <HostUser
          guideOpen={guideOpen}
          items={participants}
          letterId={letterId}
          viewDelete={viewDelete}
          setViewDelete={setViewDelete}
        />
      )}
      {memberIndex == 1 && (
        <Member
          letterId={letterId}
          guideOpen={guideOpen}
          items={participants}
          viewDelete={viewDelete}
        />
      )}
    </BackGround>
  );
};

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background: #d3edff;
  background-blend-mode: overlay, normal;
`;
const HostAlert = styled.div`
  display: flex;
  padding: var(--Border-Radius-radius_300, 8px) 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  z-index: 100;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  text-align: center;
  font-family: SUIT;
  font-weight: 500;
  font-size: 12px;
  font-style: normal;
  line-height: 16px;
  letter-spacing: -0.5px;
  position: absolute;
  left: 50%;
  top: 110px;
  transform: translateX(-50%);
  white-space: nowrap;
`;
const ExitAlert = styled.div`
  display: flex;
  padding: var(--Border-Radius-radius_300, 8px) 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  z-index: 100;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  text-align: center;
  font-family: SUIT;
  font-weight: 500;
  font-size: 12px;
  font-style: normal;
  line-height: 16px;
  letter-spacing: -0.5px;
  position: absolute;
  left: 50%;
  top: 60px;
  transform: translateX(-50%);
`;
