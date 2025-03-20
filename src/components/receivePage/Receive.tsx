import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { DoorAnimation } from "./DoorAnimation";

function Query() {
  return new URLSearchParams(useLocation().search);
}

const Receive = () => {
  const { letterId } = useParams();
  const query = Query();
  const receiver = String(query.get("to"));
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
            <Img data="/img/letter_christmas_door.png" />
          </AnimatedDiv>
          {expanded ? (
            // 2번째 화면
            <div onClick={(e) => e.stopPropagation()}>
              {hideDoorImg && (
                <TextBalloon>
                  <ExpandTitle>
                    {`${receiver}님 맞으시죠?`}
                    <br />
                    편지가 도착했어요!
                  </ExpandTitle>
                  <BalloonUnder src="/assets/text_balloon_under.svg" />
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
    transform: scale(7);
  }
`;

const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(var(--vh, 1vh) * 100);
  padding: 0 32px;
  background: #000;
  overflow: hidden;
`;

const DoorImg = styled.div<{ expanded: boolean }>`
  position: absolute;
  bottom: 0px;
  left: 0px;
  z-index: 1;
  width: 100%
  height: 70%;
  background-image: url(/assets/door.svg);
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 2s ease;

  ${({ expanded }) =>
    expanded &&
    css`
      animation: ${expandAnimation} 2s forwards;
      transform-origin: center 21%;
    `}
`;

const AnimatedDiv = styled.div<{ expanded: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transition: all 2s ease;
  filter: ${({ expanded }) => (expanded ? "none" : "blur(2px)")};

  ${({ expanded }) =>
    expanded &&
    css`
      animation: ${expandAnimation} 2s forwards;
      transform-origin: center;
    `}
`;

const Img = styled.object`
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid transparent;
  box-shadow: 0 0 0 2px #1c2231;
`;

const MainTitle = styled.div`
  font-size: 16px;
  color: #f8f9fa;
  text-align: center;
  transition: all 2s ease;
  width: 147px;
  margin-top: 10px;

  color: #f8f9fa;
  text-align: center;

  font-family: var(--Typography-family-heading, SUIT);
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: -0.5px;
`;

const MainText = styled.div`
  color: #adb5bd;
  text-align: center;

  /* body/small */
  font-family: var(--Typography-family-body, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.5px;
`;

const MainTitleContainer = styled.div`
  position: absolute;
  top: 7%;
`;

const MainInfo = styled.div`
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 5px;
  color: white;
  position: absolute;
  bottom: 40px;
  z-index: 2;

  color: #fcffaf;
  text-align: center;
  text-shadow: 0px 4px 20px rgba(255, 255, 255, 0.25);

  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.5px;
`;

const TextBalloon = styled.div`
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 3;
`;

const ExpandTitle = styled.div`
  min-width: 20%;
  max-width: 256px;
  font-size: clamp(14px, 2vw, 20px);
  color: white;
  margin-bottom: 0px;
  transition: 2s ease;
  text-align: center;
  padding: 12px 18px;

  border-radius: 12px;
  background: #243348;
  backdrop-filter: blur(2px);
  white-space: wrap;
`;

const BalloonUnder = styled.img`
  display: block;
  margin: 0 auto;
`;

const ExpandButton = styled.div`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  width: calc(100% - 100px);
  height: 48px;
  padding: 3px 20px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  text-align: center;
  border: none;
  z-index: 3;

  border-radius: 50px;
  background: #FFA256;
  box-shadow: -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset, 1px 1px 0.4px 0px rgba(255, 255, 255, 0.30) inset;
  color: #FFF;
  cursor: pointer;

  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px);
`;
