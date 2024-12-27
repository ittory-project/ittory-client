import React, { useEffect } from "react";
import animation from "../../../public/assets/loading.json";
import Player from "lottie-react";
import { useNavigate } from "react-router-dom";
import { getParticipants } from "../../api/service/LetterService";
import styled from "styled-components";

interface Props {
  loadstatus?: boolean;
  setLoad?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Loading = ({ loadstatus, setLoad }: Props) => {
  const navigate = useNavigate();

  const fetchData = async () => {
    let attempts = 0; // 시도 횟수
    let data = []; // 데이터를 담을 변수

    // 로컬스토리지에서 값 가져오기
    const letterId = Number(localStorage.getItem("letterId"));
    const userName = localStorage.getItem("userName");
    const guideOpen = localStorage.getItem("guideOpen");

    // 1초 간격으로 최대 5번 호출
    const interval = setInterval(async () => {
      try {
        data = await getParticipants(letterId);
        attempts += 1;
        console.log("반복 호출");

        if (data.length > 0) {
          clearInterval(interval); // 데이터가 있으면 반복 종료
          navigate("/Invite", {
            state: { letterId, userName, guideOpen },
          });
        } else if (attempts >= 5) {
          clearInterval(interval); // 5번 시도 후 반복 종료
          navigate("/Invite", {
            state: { letterId, userName, guideOpen },
          });
        }
      } catch (err) {
        console.error("데이터를 로딩하는 중 오류 발생:", err);
      }
    }, 1000); // 1초 간격으로 호출
  };

  useEffect(() => {
    console.log("로딩창 실행");
    fetchData();
  }, []);

  useEffect(() => {
    console.log("로딩중");
    console.log(localStorage.getItem("load"));
    if (localStorage.getItem("load") === "done") {
      if (setLoad) {
        if (loadstatus === true) {
          setLoad(true);
          console.log(loadstatus);
        } else {
          localStorage.removeItem("load");
          setLoad(false);
          console.log(loadstatus);
        }
      }
    } else {
      console.log("fetchData 실행");
      fetchData();
    }
  }, [loadstatus]);

  return (
    <BackGround>
      <Player
        animationData={animation}
        loop
        autoplay
        style={{
          height: "112px",
          width: "200px",
          margin: "0 auto",
        }}
      />
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
  justify-content: center;
  background:
    100px 100px repeat,
    #d3edff;
  background-blend-mode: overlay, normal;
`;
