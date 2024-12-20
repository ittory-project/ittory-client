import { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { HostUser } from "./HostUser";
import { Member } from "./Member";
import { getParticipants } from "../../api/service/LetterService";
import { getMyPage } from "../../api/service/MemberService";
import { stompClient } from "../../api/config/stompInterceptor";
import { WsExitResponse, WsEnterResponse } from "../../api/model/WsModel";
import { Loading } from "./Loading";

export interface Participants {
  sequence: number;
  memberId: number;
  nickname: string;
  imageUrl: string;
}

export const Invite = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const guideOpen = location.state.guideOpen;
  const getletterId = location.state.letterId;
  const userName = location.state.userName;

  console.log(guideOpen);

  const [exitAlert, setExitAlert] = useState<string | null>(null);
  const [hostAlert, setHostAlert] = useState<string | null>(null);
  const [memberIndex, setMemberIndex] = useState<number>(-1);
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [, setUserId] = useState<number>(-1);
  const [letterId] = useState<number>(getletterId);
  const [name, setName] = useState<string>("");
  const [exitName, setExitName] = useState<string>("");
  const [viewDelete, setViewDelete] = useState<boolean>(false);
  const [refresh] = useState<number>(1);
  const [load, setLoad] = useState<boolean>(true);
  const [loadstatus, setLoadstatus] = useState<boolean>(true);

  useEffect(() => {
    // 현재 페이지 상태를 푸시하여 뒤로가기 막기
    window.history.pushState(null, "", window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      // 뒤로 가기를 막고 새 페이지로 이동하지 않도록
      window.history.pushState(null, "", window.location.href);
    };

    // popstate 이벤트를 감지하여 뒤로 가기 방지
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const fetchParticipants = async () => {
    try {
      const data = await getParticipants(letterId);

      if (data.length > 0 || participants.length > 0) {
        if (data[0].nickname === name || data[0].nickname === userName) {
          setMemberIndex(0);
          setLoadstatus(false);
        } else {
          setMemberIndex(1);
          setLoadstatus(false);
        }
      } else {
        const data = await getParticipants(letterId);

        if (data.length < 1) {
          const data = await getParticipants(letterId);
          if (data.length < 1) {
            window.location.reload();
          }
        }
      }

      setParticipants(data);
    } catch (err) {
      console.error("Error fetching participants:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mydata = await getMyPage();
        const userNameFromApi = mydata.name;
        const userIdFromApi = mydata.memberId;

        setName(userNameFromApi);
        setUserId(userIdFromApi);
        if (participants.length < 1) {
          fetchParticipants();
          console.log("데이터없음-useEffect");
        } else {
          if (
            participants[0].nickname === name ||
            participants[0].nickname === userName
          ) {
            setMemberIndex(0);
            setLoadstatus(false);
          } else {
            setMemberIndex(1);
            setLoadstatus(false);
          }
        }
      } catch (err) {
        console.error("Error during data fetching:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mydata = await getMyPage();
        const data = await getParticipants(letterId);
        setParticipants(data);
        const userNameFromApi = mydata.name;
        const userIdFromApi = mydata.memberId;
        setName(userNameFromApi);
        setUserId(userIdFromApi);

        if (participants.length < 1) {
          fetchParticipants();
        } else {
          if (
            participants[0].nickname === userName ||
            participants[0].nickname === name
          ) {
            setMemberIndex(0);
            setLoadstatus(false);
          } else {
            setMemberIndex(1);
            setLoadstatus(false);
          }
        }
      } catch (err) {
        console.error("Error during data fetching:", err);
      }
    };

    fetchData();
  }, [refresh]);

  useEffect(() => {
    if (memberIndex > -1) {
      setLoadstatus(false);
    }
  }, [memberIndex]);

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

          if (
            response.action === "EXIT" &&
            "nickname" in response &&
            "isManager" in response
          ) {
            if (response.isManager) {
              console.log("방장 퇴장 감지");
              setExitAlert(`방장 '${response.nickname}'님이 퇴장했어요`);
              fetchParticipants();
              console.log(participants);
              if (participants[0]) {
                setHostAlert(
                  `참여한 순서대로 '${participants[0].nickname}'님이 방장이 되었어요`
                );
              }
            } else {
              setExitAlert(`'${response.nickname}'님이 퇴장했어요`);
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
          } else if (
            response.action === "ENTER" &&
            "participants" in response
          ) {
            console.log(response.action);
            if (response.participants) {
              setParticipants(response.participants);
            }
            console.log(participants);
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      });

      client.publish({
        destination: `/ws/letter/enter/${letterId}`,
        body: JSON.stringify({ nickname: name }),
      });
    };
    client.activate();

    return () => {
      (async () => {
        client.deactivate();
      })();
    };
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

  return (
    <BackGround>
      {load ? (
        <Loading loadstatus={loadstatus} setLoad={setLoad} />
      ) : (
        <>
          {exitAlert && <ExitAlert>{exitAlert}</ExitAlert>}
          {hostAlert && <HostAlert>{hostAlert}</HostAlert>}
          {memberIndex === 0 && (
            <>
              <HostUser
                guideOpen={guideOpen}
                items={participants}
                letterId={letterId}
                viewDelete={viewDelete}
                setViewDelete={setViewDelete}
                hostname={name}
              />
            </>
          )}
          {memberIndex === 1 && (
            <Member
              letterId={letterId}
              guideOpen={guideOpen}
              items={participants}
              viewDelete={viewDelete}
            />
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
  height: calc(var(--vh, 1vh) * 100);
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
