import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { HostUser } from "./HostUser";
import { Member } from "./Member";
import { getParticipants } from "../../api/service/LetterService";
import { getMyPage } from "../../api/service/MemberService";
import { WebSocketProvider } from "./WebSocketProvider";

export interface Participants {
  sequence: number;
  memberId: number;
  nickname: string;
  imageUrl: string;
}

interface Props {
  exitName?: string;
  setexitName?: React.Dispatch<React.SetStateAction<string | null>>;
}

//재방문유저 여부
export const Invite = ({ exitName, setexitName }: Props) => {
  const location = useLocation();
  const guideOpen = location.state.guideOpen;
  const getletterId = location.state.letterId;

  const [exitAlert, setExitAlert] = useState<string | null>(null);
  const [hostAlert, setHostAlert] = useState<string | null>(null);
  const [memberIndex, setMemberIndex] = useState<number>(-1);
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [userId, setUserId] = useState<number>(0);
  const [letterId, setLetterId] = useState<number>(getletterId);

  useEffect(() => {
    localStorage.removeItem("letterId");

    const fetchParticipants = async () => {
      try {
        const data = await getParticipants(12);
        setParticipants(data);
        console.log(data);
      } catch (err) {
        console.error("Error fetching participants:", err);
      }
    };
    const fetchMydata = async () => {
      try {
        const mydata = await getMyPage();
        setUserId(mydata.memberId);
      } catch (err) {
        console.error("Error fetching mydata:", err);
      }
    };

    fetchParticipants();
    fetchMydata();
  }, []);

  //방장 인덱스 지정
  useEffect(() => {
    if (participants.length > 0 && participants[0].memberId === userId) {
      setMemberIndex(0);
    }
  }, [participants, userId]);

  //퇴장 알림
  useEffect(() => {
    /*
    exitName이 방장이였던 경우 
    setExitAlert(`방장 '${exitName}'님이 퇴장했어요`);
    */
    setExitAlert(`'${exitName}'님이 퇴장했어요`);
    const exitTimer = setTimeout(() => {
      setExitAlert(null);
      if (setexitName) {
        setexitName(null);
      }
    }, 5000);

    return () => clearTimeout(exitTimer);
  }, [exitName]);

  //방장 바뀜 알림
  useEffect(() => {
    //const host = participants[0].nickname;
    //setHostAlert(`참여한 순서대로 '${host}'님이 방장이 되었어요`);
    const hostTimer = setTimeout(() => {
      setHostAlert(null);
    }, 10000);

    return () => clearTimeout(hostTimer);
  }, [exitName]);

  return (
    <WebSocketProvider letterId={letterId}>
      <BackGround>
        {exitName && <ExitAlert>{exitAlert}</ExitAlert>}
        {hostAlert && <HostAlert>{hostAlert}</HostAlert>}
        {memberIndex !== 0 ? (
          <HostUser
            guideOpen={guideOpen}
            items={participants}
            letterId={letterId}
          />
        ) : (
          <Member
            letterId={letterId}
            guideOpen={guideOpen}
            items={participants}
          />
        )}
      </BackGround>
    </WebSocketProvider>
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
