import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import letter from "../../../public/assets/letter.svg";
import runner from "../../../public/assets/runner.svg";
import { getParticipants } from "../../api/service/LetterService";
import { getLetterInfo } from "../../api/service/LetterService";
import { stompClient } from "../../api/config/stompInterceptor";
import { WsExitResponse, WsEnterResponse } from "../../api/model/WsModel";

export interface Participants {
  sequence: number;
  memberId: number;
  nickname: string;
  imageUrl: string;
}
interface Props {
  count: number;
  letterId: number;
}

interface UserNumElement extends HTMLElement {
  getBoundingClientRect: () => DOMRect;
}
interface PopupProps {
  isVisible: boolean;
}

export const WriteOrder = ({ count, letterId }: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const userNumsRef = useRef<(UserNumElement | null)[]>([]);
  const [items, setItems] = useState<Participants[]>([]);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const data = await getLetterInfo(letterId);
        setTitle(data.title);
      } catch (err) {
        console.error(err);
      }
    };

    fetchParticipants();
    fetchTitle();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5);
    return () => clearTimeout(timer);
  }, []);

  const fetchParticipants = async () => {
    try {
      const data = await getParticipants(12);
      setItems(data);
    } catch (err) {
      console.error("Error fetching participants:", err);
    }
  };

  //주기적으로 참가자 갱신
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchParticipants();
    }, 10000); // 10초마다 실행

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const client = stompClient();

    client.onConnect = () => {
      console.log("WebSocket connected");
      // WebSocket 구독
      client.subscribe(`/topic/letter/${letterId}`, (message: any) => {
        console.log("Received message:", message);
        try {
          const response: WsEnterResponse | WsExitResponse = JSON.parse(
            message.body
          );
          console.log(response);

          // 퇴장 메시지 처리
          if (response.action == "EXIT") {
            fetchParticipants();
          }
          // 참여 메시지 처리
          else if (response.action == "ENTER") {
            // 참여 시 서버에 입장 정보 전송
            client.publish({
              destination: `/ws/letter/enter/${letterId}`,
              body: JSON.stringify({ nickname: name }),
            });
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      });
    };
    client.activate();
  }, []);

  return (
    <BackGround>
      <Overlay />
      <TitleBar>
        <img src={letter} style={{ width: "18px", height: "14px" }} />
        <LetterTitle>{title}</LetterTitle>
        <Button>
          <img src={runner} style={{ width: "12.5px", height: "14px" }} />
          순서
        </Button>
      </TitleBar>
      <Popup isVisible={isVisible}>
        <Title>
          <Txt>
            {items.length}명의 참여자가
            <br />
            <span style={{ color: "#FFA256" }}>{count}번씩</span> 이어 쓸
            거예요!
          </Txt>
        </Title>
        <SubTitle>총 {count * items.length}개의 그림이 생성돼요</SubTitle>
        <Container>
          <TitleBox>작성 순서</TitleBox>
          {items.map((user, index) => (
            <UserList>
              <NumLine>
                <UserNum
                  key={index}
                  ref={(el: UserNumElement | null) =>
                    (userNumsRef.current[index] = el)
                  }
                >
                  <NumTxt>{index + 1}</NumTxt>
                </UserNum>
                {index !== items.length - 1 ? (
                  <SvgAdjust>
                    <SvgLine length={48} />
                  </SvgAdjust>
                ) : (
                  <></>
                )}
              </NumLine>
              <UserImage img={user.imageUrl} />
              <UserName>{user.nickname}</UserName>
            </UserList>
          ))}
        </Container>
      </Popup>
    </BackGround>
  );
};

interface SvgLineProps {
  length: number;
}
const NumLine = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const SvgLine: React.FC<SvgLineProps> = ({ length }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="2"
    height={length}
    viewBox={`0 0 2 ${length}`}
    fill="none"
    style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}
  >
    <path
      d={`M1 0L1 ${length}`}
      stroke="#6FB0FF"
      strokeOpacity="0.5"
      strokeDasharray="4 4"
    />
  </svg>
);
const SvgAdjust = styled.span`
  position: relative;
  z-index: 1;
`;

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(180deg, #212529 10.56%, #060d24 100%);
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  transition: background 0.3s ease;
  z-index: 1;
`;
const TitleBar = styled.div`
  margin: 16px 16px 4px 16px;
  display: flex;
  height: 44px;
  padding: 12px;
  align-items: center;
  gap: 12px;
  align-self: stretch;
  box-sizing: border-box;
  border-radius: 8px;
  border: 2px solid #fff;
  background: #d3edff;
`;
const LetterTitle = styled.div`
  flex: 1 0 0;
  color: #060d24;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
const Button = styled.div`
  display: flex;
  padding: var(--Border-Radius-radius_200, 6px) 10px
    var(--Border-Radius-radius_200, 6px) var(--Border-Radius-radius_300, 8px);
  align-items: center;
  gap: 4px;
  border-radius: 100px;
  border: 1px solid #fff;
  background: rgba(255, 255, 255, 0.8);
  color: #060d24;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
const Popup = styled.div<PopupProps>`
  z-index: 10;
  display: flex;
  width: 272px;
  box-sizing: border-box;
  padding: 32px 23px 26.5px 23px;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: absolute;
  top: 20%;
  border-radius: 16px;
  background: linear-gradient(144deg, #fff -0.87%, #c3f1ff 109.18%);
  box-shadow:
    0px 4px 0px 0px rgba(195, 241, 255, 0.8) inset,
    0px -4px 0px 0px rgba(0, 0, 0, 0.1) inset;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: opacity 0.04s ease-in-out;
`;
const Title = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
  text-align: center;
`;
const Txt = styled.span`
  align-self: stretch;
  color: #212529;
  text-align: center;
  font-family: SUIT;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
const SubTitle = styled.div`
  align-self: stretch;
  color: #868e96;
  text-align: center;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.5px;
`;
const Container = styled.div`
  display: flex;
  padding: 0px var(--Typography-line_height-l, 40px) 16px
    var(--Typography-line_height-l, 40px);
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
  border: 3px solid #d3edff;
  background: #fff;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
`;
const TitleBox = styled.div`
  margin-bottom: 6px;
  display: flex;
  width: 106px;
  box-sizing: border-box;
  padding: var(--Border-Radius-radius_100, 4px) 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 0px 0px 12px 12px;
  background: #d3edff;
  box-shadow: 0px -2px 0px 0px rgba(0, 0, 0, 0.04) inset;
  color: var(--Color-secondary-blue, #4db4ff);
  text-align: center;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
const UserNum = styled.div`
  display: flex;
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  padding: 2px 4px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 50px;
  background: #4db4ff;
`;
const NumTxt = styled.div`
  color: #fff;
  text-align: center;
  font-family: "Gmarket Sans";
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: -0.5px;
  z-index: 10;
  margin-right: 0.4px;
  margin-bottom: 0.3px;
`;
const UserList = styled.div`
  display: flex;
  align-items: center;
  align-self: stretch;
  margin-top: 10px;
`;
const UserImage = styled.div<{ img: string }>`
  width: 36px;
  height: 36px;
  border-radius: 158.73px;
  border: 1px solid #fff;
  background-image: url(${(props) => props.img});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin-left: 16px;
`;
const UserName = styled.div`
  margin-left: 6px;
  color: #212529;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
