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
import texture from "../../../public/assets/invite/texture1.png";
import { quitLetterWs } from "../../api/service/WsService";

export interface Participants {
  sequence: number;
  memberId: number;
  nickname: string;
  imageUrl: string;
}

export const Invite = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [exitAlert, setExitAlert] = useState<string | null>(null);
  const [hostAlert, setHostAlert] = useState<string | null>(null);
  const [memberIndex, setMemberIndex] = useState<number>(-1);
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [, setUserId] = useState<number>(-1);

  const getletterId = location.state.letterId;
  const userName = location.state.userName;
  const guideOpen = location.state.guideOpen;

  const [letterId] = useState<number>(getletterId);
  const [name, setName] = useState<string>("");
  const [exitName, setExitName] = useState<string>("");
  const [viewDelete, setViewDelete] = useState<boolean>(false);
  const [refresh] = useState<number>(1);
  const [load, setLoad] = useState<boolean>(true);
  const [loadstatus, setLoadstatus] = useState<boolean>(true);
  const [hasRefreshed] = useState<boolean>(false); // 새로고침 여부 체크

  const fetchParticipants = async () => {
    try {
      setLoad(true);
      const data = await getParticipants(letterId);

      if (data.length > 0 || participants.length > 0) {
        if (data[0].nickname) {
          console.log(data[0].nickname);
          console.log(name);
          console.log(userName);
          console.log(data.length);
          console.log(participants.length);
          console.log(data);
          if (data[0].nickname === name || data[0].nickname === userName) {
            console.log("방장지정");
            setMemberIndex(0);
            setLoadstatus(false);
            setLoad(false);
            localStorage.removeItem("load");
          } else {
            console.log("방장지정");
            setMemberIndex(1);
            setLoadstatus(false);
            setLoad(false);
            localStorage.removeItem("load");
          }
        }
      } else {
        if (!hasRefreshed) {
          console.log(localStorage.getItem("load"));
          if (localStorage.getItem("load") === "done") {
            setLoad(true);
            setLoadstatus(true);
            console.log("로딩이미했음");
          } else {
            console.log("로딩 페이지로");
            localStorage.setItem("load", "done");
            navigate("/loading", {
              state: {
                letterId: getletterId,
                userName: userName,
                guideOpen: guideOpen,
              },
            });
          }
        }
      }
    } catch (err) {
      console.error("Error fetching participants:", err);
      setLoadstatus(false);
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
        console.log(participants);
        if (participants.length < 1) {
          fetchParticipants();
          console.log("데이터없음-useEffect");
        } else {
          console.log("데이터들어옴");
          /*
          if (
            participants[0].nickname === name ||
            participants[0].nickname === userName
          ) {
            console.log("방장지정");

            setMemberIndex(0);
            localStorage.removeItem("load");
            setLoadstatus(false);
            setLoad(false);
          } else {
            console.log("방장지정");

            setMemberIndex(1);
            localStorage.removeItem("load");
            setLoadstatus(false);
            setLoad(false);
          }*/
          if (participants[0].nickname) {
            if (
              participants[0].nickname === name ||
              participants[0].nickname === userName
            ) {
              console.log("방장지정");
              setMemberIndex(0);
              setLoadstatus(false);
              setLoad(false);
              localStorage.removeItem("load");
            } else {
              console.log("방장지정");
              setMemberIndex(1);
              setLoadstatus(false);
              setLoad(false);
              localStorage.removeItem("load");
            }
          } else {
            if (!hasRefreshed) {
              console.log(localStorage.getItem("load"));
              if (localStorage.getItem("load") === "done") {
                setLoad(true);
                setLoadstatus(true);
                console.log("로딩이미했음");
              } else {
                console.log("로딩 페이지로");
                localStorage.setItem("load", "done");
                navigate("/loading", {
                  state: {
                    letterId: getletterId,
                    userName: userName,
                    guideOpen: guideOpen,
                  },
                });
              }
            }
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
        const userNameFromApi = mydata.name;
        const userIdFromApi = mydata.memberId;

        setName(userNameFromApi);
        setUserId(userIdFromApi);
        console.log(participants);
        if (participants.length < 1) {
          fetchParticipants();
          console.log("데이터없음-useEffect");
        } else {
          if (participants[0].nickname) {
            if (
              participants[0].nickname === name ||
              participants[0].nickname === userName
            ) {
              console.log("방장지정");
              setMemberIndex(0);
              setLoadstatus(false);
              setLoad(false);
              localStorage.removeItem("load");
            } else {
              console.log("방장지정");
              setMemberIndex(1);
              setLoadstatus(false);
              setLoad(false);
              localStorage.removeItem("load");
            }
          } else {
            if (!hasRefreshed) {
              console.log(localStorage.getItem("load"));
              if (localStorage.getItem("load") === "done") {
                setLoad(true);
                setLoadstatus(true);
                console.log("로딩이미했음");
              } else {
                console.log("로딩 페이지로");
                localStorage.setItem("load", "done");
                navigate("/loading", {
                  state: {
                    letterId: getletterId,
                    userName: userName,
                    guideOpen: guideOpen,
                  },
                });
              }
            }
          }
        }
      } catch (err) {
        console.error("Error during data fetching:", err);
      }
    };

    fetchData();
  }, [participants]);

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
      } catch (err) {
        console.error("Error during data fetching:", err);
      }
    };

    fetchData();
  }, [refresh]);

  useEffect(() => {
    if (memberIndex > -1) {
      console.log(memberIndex);
      localStorage.removeItem("load");
      setLoadstatus(false);
      setLoad(false);
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

  console.log(load);
  console.log(participants);
  console.log(memberIndex);

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

  //브라우저 종료시 소켓 탈퇴 처리
  useEffect(() => {
    // 페이지 종료 이벤트 핸들러
    const handleBeforeUnload = () => {
      quitLetterWs(letterId); // 웹소켓 퇴장 처리
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      quitLetterWs(letterId);
    };
  }, []);

  return (
    <BackGround>
      {load || memberIndex < 0 ? (
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
  //left: 50%;
  //transform: translateX(-50%);
  background:
    url(${texture}) 0 0 / auto auto repeat,
    /* 질감 이미지 크기 자동 조정 */ #d3edff; /* 기본 배경색 */
  background-blend-mode: overlay;
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
