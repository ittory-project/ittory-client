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
  const userName = location.state.userName;

  const [exitAlert, setExitAlert] = useState<string | null>(null);
  const [hostAlert, setHostAlert] = useState<string | null>(null);
  const [memberIndex, setMemberIndex] = useState<number>(-1);
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [prevParticipants, setPrevParticipants] = useState<Participants[]>([]);
  const [userId, setUserId] = useState<number>(-1);
  const [letterId, setLetterId] = useState<number>(getletterId);
  const [name, setName] = useState<string>("");
  const [exitName, setExitName] = useState<string>("");
  const [viewDelete, setViewDelete] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<number>(1);
  const [loading, setLoading] = useState<number>(-1);
  const [load, setLoad] = useState<boolean>(true);

  const fetchParticipants = async () => {
    try {
      const data = await getParticipants(letterId);

      if (data.length > 0) {
        // 방장 여부 체크
        if (data[0].nickname === userName) {
          setMemberIndex(0);
        } else {
          setMemberIndex(1);
        }
      }

      setPrevParticipants(participants);
      setParticipants(data);
    } catch (err) {
      console.error("Error fetching participants:", err);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const mydata = await getMyPage();
        const userNameFromApi = mydata.name;
        const userIdFromApi = mydata.memberId;
        setName(userNameFromApi);
        setUserId(userIdFromApi);
      } catch (err) {
        console.error("Error during initial data fetch:", err);
      }
    };

    fetchInitialData();
    console.log("Initial fetch started");
  }, []);

  useEffect(() => {
    if (participants.length > 0) {
      if (participants[0].nickname == userName) {
        setMemberIndex(0); // 방장 여부 체크
        setLoad(true);
      } else {
        setMemberIndex(1);
        setLoad(true);
      }
    }
  }, [participants]);

  // 참가자 목록을 비동기적으로 가져오는 함수
  const fetchParticipantsData = async () => {
    try {
      setLoad(true);
      const participantsData = await getParticipants(letterId);

      // 데이터가 변경되었을 경우에만 상태 업데이트
      if (participantsData.length > 0) {
        console.log(participantsData);
        if (participantsData[0].nickname == userName) {
          console.log(participantsData[0].nickname);
          console.log(userName);
          setLoading(0);
          setMemberIndex(0); // 방장 여부 체크
          console.log("방장여부체크");
          setParticipants(participantsData);
          setLoad(false);
        } else {
          setMemberIndex(1);
          setLoading(1);
          console.log("방장여부체크");
          setParticipants(participantsData);
          setLoad(false);
        }
        setLoad(false);
        console.log("Participants data:", participantsData);
        console.log(memberIndex);
        //setParticipants(participantsData);
        //setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching participants:", err);
    }
  };

  useEffect(() => {
    if (loading === 1) {
      setMemberIndex(1);
    } else {
      setMemberIndex(0);
    }
    setLoad(false);
  }, [loading]);

  useEffect(() => {
    console.log("memberIndex has changed:", memberIndex);
  }, [memberIndex]);

  useEffect(() => {
    if (letterId) {
      fetchParticipantsData(); // 참가자 목록을 비동기적으로 가져오기
      console.log("fetchparti start");
    }
  }, [refresh]);

  useEffect(() => {
    // participants 배열이 비어있지 않으면, 데이터가 준비된 것이므로 렌더링
    if (participants.length > 0) {
      if (participants[0].nickname === userName) {
        setMemberIndex(0); // 방장 여부 체크
      } else {
        setMemberIndex(1);
      }
    }
  }, [participants]);

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
            if (response.nickname === prevParticipants[0].nickname) {
              setExitAlert(`방장 '${exitName}'님이 퇴장했어요`);
              setHostAlert(`참여한 순서대로 '${exitName}'님이 방장이 되었어요`);
              fetchParticipants();
            } else {
              setExitAlert(`'${exitName}'님이 퇴장했어요`);
              fetchParticipants();
            }
          } else if (response.action === "END") {
            setViewDelete(true);
          } else if (response.action === "START") {
            navigate("/Connection", {
              state: {
                letterId: letterId,
              },
            });
          } else if (response.action === "ENTER") {
            setRefresh((refresh) => refresh * -1);
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
  }, []);

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
  //participants && memberIndex !== -1 && name != "" &&

  return (
    <BackGround>
      {memberIndex === -1 ? (
        <></>
      ) : (
        <>
          {exitName && <ExitAlert>{exitAlert}</ExitAlert>}
          {hostAlert && <HostAlert>{hostAlert}</HostAlert>}

          {participants.length > 0 && memberIndex !== -1 && name !== "" && (
            <>
              {memberIndex === 0 ? (
                <HostUser
                  guideOpen={guideOpen}
                  items={participants}
                  letterId={letterId}
                  viewDelete={viewDelete}
                  setViewDelete={setViewDelete}
                />
              ) : (
                <Member
                  letterId={letterId}
                  guideOpen={guideOpen}
                  items={participants}
                  viewDelete={viewDelete}
                />
              )}
            </>
          )}
        </>
      )}
    </BackGround>
  );
};

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100%;
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
