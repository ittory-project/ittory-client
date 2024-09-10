import { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { DoorAnimation } from './DoorAnimation';

const Receive = () => {
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

  return (
    <>
      {showDoorAnimation ? (
        <DoorAnimation />
      ) : (
        <Container onClick={handleClick}>
          <DoorImg expanded={expanded}>
          </DoorImg>
          <AnimatedDiv expanded={expanded}>
              <Img src="/img/profile.png" expanded={expanded} />
          </AnimatedDiv>
          {expanded ? (
            // 2번째 화면
            <div onClick={(e) => e.stopPropagation()}>
              {hideDoorImg && 
                <TextBalloon>
                  <ExpandTitle>열두글자닉네임안녕하세요님 맞으시죠?<br/>편지가 도착했어요!</ExpandTitle>
                  <BalloonUnder src='/assets/text_balloon_under.svg' />
                </TextBalloon>
              }
              {hideDoorImg && 
                <ExpandButton onClick={handleButtonClick} >
                  네 맞아요!
                </ExpandButton>
              }
            </div> ) : (
              // 기존 화면
              <>
                <MainTitleContainer>
                  <MainText>띵동~</MainText>
                  <MainTitle>선재님에게 편지가 도착했어요</MainTitle>
                </MainTitleContainer>
                <MainInfo>문을 터치해 보세요</MainInfo>
              </>
            )
          }
        </Container>
      )}
    </>
  );
};

export default Receive;

// 문, 이미지 커지는 애니메이션
const expandAnimation = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(6);
  }
`;

const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #000;
  overflow: hidden;
`;

const DoorImg = styled.div<{ expanded: boolean }>`
  position: absolute;
  bottom: 0px;
  z-index: 1;
  width: 90%;
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
  top: 45%;
  transition: all 2s ease;
`;

const Img = styled.img<{ expanded: boolean }>`
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 50%;
  filter: ${({ expanded }) => (expanded ? 'none' : 'blur(2px)')};
  transition: all 2s ease;

    ${({ expanded }) =>
    expanded &&
    css`
      animation: ${expandAnimation} 2s forwards;
      transform-origin: center;
    `}
`;

const MainTitle = styled.div`
  font-size: 16px;
  color: #F8F9FA;
  text-align: center;
  transition: all 2s ease;
  width: 147px;
  margin-top: 10px;

  color: #F8F9FA;
  text-align: center;

  font-family: var(--Typography-family-heading, SUIT);
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: -0.5px;
`;

const MainText = styled.div`
  color: #ADB5BD;
  text-align: center;

  /* body/small */
  font-family: var(--Typography-family-body, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.5px;
`

const MainTitleContainer = styled.div`
  position: absolute;
  top: 10%;
`

const MainInfo = styled.div`
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 5px;
  color: white;
  position: absolute;
  bottom: 50px;
  z-index: 2;

  color: #FCFFAF;
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
  max-width: 90%;
  font-size: clamp(14px, 2vw, 20px);
  color: white;
  margin-bottom: 0px;
  transition: 2s ease;
  text-align: center;
  padding: 12px 18px;

  border-radius: 12px;
  background: #243348;
  backdrop-filter: blur(2px);
  white-space: nowrap;
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
  width: 288px;
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
  letter-spacing: -0.5px;
`;