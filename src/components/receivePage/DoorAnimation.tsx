import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

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

export const DoorAnimation = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('letter')
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
    return (
        <Container>
            <Door>
                <Handle src="/assets/doorknob.svg" />
            </Door>
        </Container>
    );
}

const Container = styled.div`
    background: linear-gradient(162deg, #FFF2CA 0%, #AE8D57 100%);
    width: 100%;
    height: 100vh;
`;

const Door = styled.div`
    background-color: #060D24;
    position: relative;
    width: 100%;
    height: 100%;
    animation: ${openDoor} 1.5s ease forwards;
    animation-delay: 1.5s;
    overflow: hidden;
`;

const Handle = styled.img`
    width: 124px;
    height: 62px;
    position: absolute;
    right: 30px;
    top: 50%;
    transform-origin: calc(100% - 30px) center;
    animation: ${rotateHandle} 1.5s ease-in-out forwards, ${reduceHandleSize} 1.5s ease forwards;
    animation-delay: 0s, 1.5s;
`;
