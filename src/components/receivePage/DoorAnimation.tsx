import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

import doorKnobSvg from '@/assets/doorknob.svg';

interface Props {
  letterId: string;
}

const rotateHandle = keyframes`
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-30deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

const openDoor = keyframes`
  0% {
    width: 100%;
  }
  100% {
    width: 95%;
  }
`;

const reduceHandleSize = keyframes`
  0% {
    width: 124px;
  }
  100% {
    width: 115px;
  }
`;

export const DoorAnimation = ({ letterId }: Props) => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/receive/letter/${letterId}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <Container>
      <Door>
        <Handle src={doorKnobSvg} />
      </Door>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  background: linear-gradient(162deg, #fff2ca 0%, #ae8d57 100%);
`;

const Door = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  overflow: hidden;

  background-color: #060d24;

  animation: ${openDoor} 1.5s ease forwards;
  animation-delay: 1.5s;
`;

const Handle = styled.img`
  position: absolute;
  top: 50%;
  right: 30px;

  width: 124px;
  height: 62px;

  transform-origin: calc(100% - 30px) center;

  animation:
    ${rotateHandle} 1.5s ease-in-out forwards,
    ${reduceHandleSize} 1.5s ease forwards;
  animation-delay: 0s, 1.5s;
`;
