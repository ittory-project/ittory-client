import React, { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import letter from '../../../public/assets/letter.svg';
import runner from '../../../public/assets/runner.svg';
import { stompClient } from '../../api/config/stompInterceptor';
import { WsEnterResponse, WsExitResponse } from '../../api/model/WsModel';
import { getParticipants } from '../../api/service/LetterService';
import { getLetterInfo } from '../../api/service/LetterService';
import { getLetterStartInfo } from '../../api/service/LetterService';

export interface Participants {
  sequence: number;
  memberId: number;
  nickname: string;
  imageUrl: string;
}
interface Props {
  letterId: number;
}

interface UserNumElement extends HTMLElement {
  getBoundingClientRect: () => DOMRect;
}
interface PopupProps {
  isVisible: boolean;
}

export const WriteOrder = ({ letterId }: Props) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const userNumsRef = useRef<(UserNumElement | null)[]>([]);
  const [items, setItems] = useState<Participants[]>([]);
  const [title, setTitle] = useState<string>('');
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchTitle = async () => {
      const data = await getLetterInfo(letterId);
      setTitle(data.title);
    };
    const fetchCount = async () => {
      const data = await getLetterStartInfo(letterId);
      setCount(data.repeatCount);
    };

    fetchParticipants();
    fetchTitle();
    fetchCount();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5);
    return () => clearTimeout(timer);
  }, []);

  const fetchParticipants = async () => {
    const data = await getParticipants(letterId);
    setItems(data);
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
      // WebSocket 구독
      client.subscribe(`/topic/letter/${letterId}`, (message) => {
        const response: WsEnterResponse | WsExitResponse = JSON.parse(
          message.body,
        );

        // 퇴장 메시지 처리
        if (response.action === 'EXIT') {
          fetchParticipants();
        }
      });
    };

    client.activate();
  }, []);

  return (
    <BackGround>
      <Overlay />
      <TitleBar>
        <img src={letter} style={{ width: '18px', height: '14px' }} />
        <LetterTitle>{title}</LetterTitle>
        <Button>
          <img src={runner} style={{ width: '12.5px', height: '14px' }} />
          순서
        </Button>
      </TitleBar>
      <Popup isVisible={isVisible}>
        <Title>
          <Txt>
            {items.length}명의 참여자가
            <br />
            <span style={{ color: '#FFA256' }}>{count}번씩</span> 이어 쓸
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
    style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
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
  position: relative;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #212529 10.56%, #060d24 100%);
  transform: translateX(-50%);
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  transition: background 0.3s ease;
`;
const TitleBar = styled.div`
  box-sizing: border-box;
  display: flex;
  gap: 12px;
  align-items: center;
  align-self: stretch;
  height: 44px;
  padding: 12px;
  margin: 16px 16px 4px 16px;
  background: #d3edff;
  border: 2px solid #fff;
  border-radius: 8px;
`;
const LetterTitle = styled.div`
  flex: 1 0 0;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px;
  color: #060d24;
  letter-spacing: -0.5px;
`;
const Button = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  padding: var(--Border-Radius-radius_200, 6px) 10px
    var(--Border-Radius-radius_200, 6px) var(--Border-Radius-radius_300, 8px);
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px;
  color: #060d24;
  letter-spacing: -0.5px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #fff;
  border-radius: 100px;
`;
const Popup = styled.div<PopupProps>`
  position: absolute;
  top: 20%;
  z-index: 10;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  width: 272px;
  padding: 32px 23px 26.5px 23px;
  background: linear-gradient(144deg, #fff -0.87%, #c3f1ff 109.18%);
  border-radius: 16px;
  box-shadow:
    0px 4px 0px 0px rgba(195, 241, 255, 0.8) inset,
    0px -4px 0px 0px rgba(0, 0, 0, 0.1) inset;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: opacity 0.04s ease-in-out;
`;
const Title = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
const Txt = styled.span`
  align-self: stretch;
  font-family: SUIT;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  color: #212529;
  text-align: center;
  letter-spacing: -0.5px;
`;
const SubTitle = styled.div`
  align-self: stretch;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  color: #868e96;
  text-align: center;
  letter-spacing: -0.5px;
`;
const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0px var(--Typography-line_height-l, 40px) 16px
    var(--Typography-line_height-l, 40px);
  background: #fff;
  border: 3px solid #d3edff;
  border-radius: 12px;
`;
const TitleBox = styled.div`
  box-sizing: border-box;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  width: 106px;
  padding: var(--Border-Radius-radius_100, 4px) 20px;
  margin-bottom: 6px;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  color: var(--Color-secondary-blue, #4db4ff);
  text-align: center;
  letter-spacing: -0.5px;
  background: #d3edff;
  border-radius: 0px 0px 12px 12px;
  box-shadow: 0px -2px 0px 0px rgba(0, 0, 0, 0.04) inset;
`;
const UserNum = styled.div`
  box-sizing: border-box;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 2px 4px;
  background: #4db4ff;
  border-radius: 50px;
`;
const NumTxt = styled.div`
  z-index: 10;
  margin-right: 0.4px;
  margin-bottom: 0.3px;
  font-family: 'Gmarket Sans';
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  color: #fff;
  text-align: center;
  letter-spacing: -0.5px;
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
  margin-left: 16px;
  background-image: url(${(props) => props.img});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border: 1px solid #fff;
  border-radius: 158.73px;
`;
const UserName = styled.div`
  margin-left: 6px;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  color: #212529;
  letter-spacing: -0.5px;
`;
