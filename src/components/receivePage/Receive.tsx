import { useState } from 'react';

import { useLocation, useParams } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';

import doorSvg from '@/assets/door.svg';
import thumbnailSpringSummer from '@/assets/receive/thumbnail-spring-summer.png';
import textBalloonUnder from '@/assets/text_balloon_under.svg';

import { DoorAnimation } from './DoorAnimation';

function Query() {
  return new URLSearchParams(useLocation().search);
}

const Receive = () => {
  const { letterId } = useParams();
  const query = Query();
  const receiver = String(query.get('to'));
  const [expanded, setExpanded] = useState(false);
  const [showDoorAnimation, setShowDoorAnimation] = useState(false);
  const [hideDoorImg, setHideDoorImg] = useState(false);

  // 애니메이션 실행 후 1.5초 이후에 2번째 애니메이션 화면 상태(setHideDoorImg)로 넘어감
  const handleClick = () => {
    setExpanded(true);
    setTimeout(() => {
      setHideDoorImg(true);
    }, 1500);
  };

  const handleButtonClick = () => {
    setShowDoorAnimation(true);
  };

  return letterId ? (
    <>
      {showDoorAnimation ? (
        <DoorAnimation letterId={letterId} />
      ) : (
        <Container onClick={handleClick}>
          <DoorImg expanded={expanded}></DoorImg>
          <AnimatedDiv expanded={expanded}>
            <CharacterWrapper>
              <CharacterImage src={thumbnailSpringSummer} />
            </CharacterWrapper>
          </AnimatedDiv>
          {expanded ? (
            // 2번째 화면
            <div onClick={(e) => e.stopPropagation()}>
              {hideDoorImg && (
                <TextBalloon>
                  <ExpandTitle>
                    {`${receiver}님 맞으시죠?\n편지가 도착했어요!`}
                  </ExpandTitle>
                  <BalloonUnder src={textBalloonUnder} />
                </TextBalloon>
              )}
              {hideDoorImg && (
                <ExpandButton onClick={handleButtonClick}>
                  네 맞아요!
                </ExpandButton>
              )}
            </div>
          ) : (
            // 기존 화면
            <>
              <MainTitleContainer>
                <MainText>띵동~</MainText>
                <MainTitle>{`${receiver}님에게 편지가 도착했어요`}</MainTitle>
              </MainTitleContainer>
              <MainInfo>문을 터치해 보세요</MainInfo>
            </>
          )}
        </Container>
      )}
    </>
  ) : (
    <>조회할 수 없는 편지입니다.</>
  );
};

export default Receive;

// 문, 이미지 커지는 애니메이션
const expandAnimation = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(8.53); // 30*30 -> 256*256
  }
`;

const Container = styled.div`
  position: relative;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  height: calc(var(--vh, 1vh) * 100);

  padding: 0 32px;

  overflow: hidden;

  background: #000;
`;

const DoorImg = styled.div<{ expanded: boolean }>`
  position: absolute;
  bottom: 0px;
  left: 0px;
  z-index: 1;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: 70%;

  background-image: url(${doorSvg});
  background-size: cover;

  transition: all 2s ease;

  ${({ expanded }) =>
    expanded &&
    css`
      transform-origin: center 21%;

      animation: ${expandAnimation} 2s forwards;
    `}
`;

const AnimatedDiv = styled.div<{ expanded: boolean }>`
  position: absolute;
  top: 50%;
  z-index: 2;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 30px;
  height: 30px;

  border-radius: 50%;

  filter: ${({ expanded }) => (expanded ? 'none' : 'blur(1.5px)')};

  transition: all 2s ease;

  ${({ expanded }) =>
    expanded &&
    css`
      transform-origin: center;

      animation: ${expandAnimation} 2s forwards;
    `}
`;

const CharacterWrapper = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;

  padding: 2px;

  background: transparent;
  background: linear-gradient(323.8deg, #1c2231 14.11%, #243348 85.81%);
  border-radius: 50%;
  box-shadow: 0px 0px 5px 0px rgba(255, 255, 255, 0.1);
`;

const CharacterImage = styled.img`
  width: 22px;
  height: 22px;

  object-fit: cover;

  border: 2px solid var(--Color-secondary-dark_navy_blue);
  border-radius: 50%;
`;

const MainTitle = styled.div`
  width: 256px;

  margin-top: 10px;

  font-family: var(--Typography-family-heading, SUIT);
  font-size: 16px;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;

  line-height: 28px;

  color: #f8f9fa;
  color: #f8f9fa;

  text-align: center;
  text-align: center;
  letter-spacing: -0.5px;

  transition: all 2s ease;
`;

const MainText = styled.div`
  /* body/small */
  font-family: var(--Typography-family-body, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;

  line-height: 20px;

  color: #adb5bd;

  text-align: center;
  letter-spacing: -0.5px;
`;

const MainTitleContainer = styled.div`
  position: absolute;
  top: 40px;
`;

const MainInfo = styled.div`
  position: absolute;
  bottom: 40px;
  z-index: 2;

  padding: 5px 10px;

  font-family: var(--Typography-family-title, SUIT);
  font-size: 14px;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;

  line-height: 24px;

  color: white;
  color: #fcffaf;

  text-align: center;
  letter-spacing: -0.5px;

  text-shadow: 0px 4px 20px rgba(255, 255, 255, 0.25);

  border-radius: 5px;
`;

const TextBalloon = styled.div`
  position: absolute;
  /* NOTE: 반응형 위해 중점 기준으로 좌표 잡고, 중점으로부터 206px 지점이 원 둘레 지점이어서, 24px 갭을 위해 230px로 지정함 */
  top: calc(50% - 230px);
  left: 50%;
  z-index: 3;

  text-align: center;

  transform: translateX(-50%);
`;

const ExpandTitle = styled.div`
  min-width: 20%;
  max-width: 256px;

  padding: 12px 18px;
  margin-bottom: 0px;

  font-family: var(--Typography-family-title);
  font-size: clamp(14px, 2vw, 20px);

  color: white;

  text-align: center;
  white-space: pre-wrap;

  background: #243348;
  border-radius: 12px;

  backdrop-filter: blur(2px);

  transition: 2s ease;
`;

const BalloonUnder = styled.img`
  display: block;

  margin: 0 auto;
`;

const ExpandButton = styled.div`
  position: absolute;
  bottom: 50px;
  left: 50%;
  z-index: 3;

  display: flex;

  gap: 8px;
  align-items: center;
  justify-content: center;

  width: calc(100% - 100px);
  height: 48px;

  padding: 3px 20px;

  font-family: var(--Typography-family-title);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #FFF;

  text-align: center;
  letter-spacing: -0.5px);

  cursor: pointer;

  background: #FFA256;
  border: none;
  border-radius: 50px;
  box-shadow: -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset, 1px 1px 0.4px 0px rgba(255, 255, 255, 0.30) inset;

  transform: translateX(-50%);
`;
