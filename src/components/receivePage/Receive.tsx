import { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { DoorAnimation } from './DoorAnimation';

const Receive = () => {
  const [expanded, setExpanded] = useState(false);
  const [showDoorAnimation, setShowDoorAnimation] = useState(false);
  const [hideDoorImg, setHideDoorImg] = useState(false); 

  const handleClick = () => {
    setExpanded(true);
    setTimeout(() => {
      setHideDoorImg(true); 
    }, 1500);
  };

  const handleButtonClick = () => {
    console.log("why");
    setShowDoorAnimation(true);
  };

  return (
    <>
      {showDoorAnimation ? (
        <DoorAnimation />
      ) : (
        <Container onClick={handleClick}>
          <DoorImg expanded={expanded} hide={hideDoorImg}>
            <AnimatedDiv expanded={expanded}>
              <Img src="/img/profile.png" expanded={expanded} />
            </AnimatedDiv>
          </DoorImg>
          {expanded ? (
            <div  onClick={(e) => e.stopPropagation()}>
              {hideDoorImg && <ExpandTitle>선재님 맞으시죠? 편지가 도착했어요!</ExpandTitle>}
              <ExpandButton onClick={handleButtonClick} >
                네 맞아요!
              </ExpandButton>
            </div> ) : (
              <>
                <SmallText expanded={expanded}>선재님에게 편지가 도착했어요</SmallText>
                <SmallInfo>문을 터치해 보세요</SmallInfo>
              </>
            )
          }
        </Container>
      )}
    </>
  );
};

export default Receive;

const expandAnimation = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(5);
  }
`;

const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: var(--color-black-white-black, #000);
  overflow: hidden;
`;

const DoorImg = styled.div<{ expanded: boolean, hide: boolean }>`
  position: absolute;
  bottom: 0px;
  z-index: 1;
  width: 400px;
  height: 600px;
  background-image: ${({ hide }) => (hide ? '' : 'url(/assets/door.svg)' )};
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 2s ease;
  // cursor: pointer;

  ${({ expanded }) =>
    expanded &&
    css`
      animation: ${expandAnimation} 2s forwards;
      transform-origin: center;
    `}
`;

const Img = styled.img<{ expanded: boolean }>`
  width: ${({ expanded }) => (expanded ? '50px' : '50px')};
  height: ${({ expanded }) => (expanded ? '50px' : '50px')};
  object-fit: cover;
  border-radius: 50%;
  filter: ${({ expanded }) => (expanded ? 'none' : 'blur(5px)')};
  transition: all 2s ease;
`;

const AnimatedDiv = styled.div<{ expanded: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: absolute;
  top: 150px;
  transition: all 2s ease;

  ${({ expanded }) =>
    expanded &&
    css`
      width: 50px;
      height: 50px;
      top: 50%; 
      transform: translateY(-90%);
    `}
`;
 
const SmallText = styled.div<{ expanded: boolean }>`
  font-size: 16px;
  color: var(--Color-grayscale-gray50, #F8F9FA);
  text-align: center;
  position: absolute;
  top: 200px;
  transition: all 2s ease;
`;

const ExpandTitle = styled.div`
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  color: white;
  margin-bottom: 20px;
  transition: 2s ease;
  text-align: center; /* 추가적으로 가운데 정렬 */
`;

const ExpandButton = styled.button`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  width: 288px;
  height: var(--Typography-line_height-xl, 48px);
  padding: 14px 20px;
  align-items: center;
  gap: var(--Border-Radius-radius_300, 8px);
  text-align: center;
  border: none;
  z-index: 3;

  border-radius: var(--Border-Radius-radius_circle, 50px);
  background: var(--Color-primary-orange, #FFA256);
  box-shadow: -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset, 1px 1px 0.4px 0px rgba(255, 255, 255, 0.30) inset;
  color: var(--color-black-white-white, #FFF);
  cursor: pointer;
`;

const SmallInfo = styled.div`
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 5px;
  color: white;
  margin-top: 10px;
  position: absolute;
  bottom: 200px;
  z-index: 2;
`;
