import { useState } from 'react';
import styled, { css } from 'styled-components';
import { DoorAnimation } from './DoorAnimation';

const Receive = () => {
  const [expanded, setExpanded] = useState(false);
  const [showDoorAnimation, setShowDoorAnimation] = useState(false); 

  const handleClick = () => {
    setExpanded(true);
  };

  const handleButtonClick = () => {
    setShowDoorAnimation(true); 
  };

  return (
    <>
      {showDoorAnimation ? <DoorAnimation /> :
        <Container onClick={handleClick}>
          {expanded ? (
            <>
              <Text style={{ opacity: expanded ? 1 : 0 }}>Hello World!</Text>
              <AnimatedDiv expanded={expanded}>
                <Img src="/img/profile.png" expanded={expanded} />  
              </AnimatedDiv>
              <Button
                style={{ opacity: expanded ? 1 : 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleButtonClick();
                }}
              >
                Click Me
              </Button>
            </>
          ) : (
            <>
              <SmallText>Small State Text</SmallText>
              <AnimatedDiv expanded={expanded}>
                <Img src="/img/profile.png" expanded={expanded} />  
              </AnimatedDiv>
              <SmallButton>Small State Button</SmallButton>
            </>
          )}
        </Container>
      }
    </>
  );
};

export default Receive;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
  overflow: hidden;
`;

const Img = styled.img<{ expanded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  filter: ${({ expanded }) => (expanded ? 'none' : 'blur(5px)')};
`;

const AnimatedDiv = styled.div<{ expanded: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: #3498db;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.5s ease;

  ${({ expanded }) =>
    expanded &&
    css`
      width: 300px;
      height: 300px;
    `}
`;

const Text = styled.div`
  font-size: 24px;
  color: white;
  margin-bottom: 20px;
  opacity: 0;
  transition: opacity 0.5s ease;
`;

const SmallText = styled.div`
  font-size: 16px;
  color: black;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  background-color: #2ecc71;
  color: white;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.5s ease;
  margin-top: 20px;
`;

const SmallButton = styled.button`
  padding: 5px 10px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  background-color: #e74c3c;
  color: white;
  cursor: pointer;
  margin-top: 10px;
`;
