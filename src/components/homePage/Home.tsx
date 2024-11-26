import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import logo from "../../../public/assets/home/logo.svg";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
const bg1 = "/assets/home/main.jpg";
const bg2 = "/assets/home/01.jpg";
const bg3 = "/assets/home/02.jpg";
const bg4 = "/assets/home/03.jpg";
const bg5 = "/assets/home/04.jpg";
const bg6 = "/assets/home/05.jpg";
const bg7 = "/assets/home/06.jpg";
const bg8 = "/assets/home/07.jpg";

interface Props {
  img: string;
}

export const Home = () => {
  const navigate = useNavigate();

  const handleButton = () => {
    if (localStorage.jwt) {
      navigate("/create");
    } else {
      navigate("/login");
    }
  };
  return (
    <>
      <Container>
        <Header />
        <>
          <FirstSection img={bg1}>
            <Logo img={logo} />
            <ButtonContainer onClick={handleButton}>
              <ButtonTxt>편지 쓰러 가기</ButtonTxt>
            </ButtonContainer>
          </FirstSection>
          <Section img={bg2} />
          <Section img={bg3} />
          <WhiteSection img={bg4} />
          <WhiteSection img={bg5} />
          <Section img={bg6} />
          <WhiteSection img={bg7} />
          <Section img={bg8} />
        </>
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow-y: scroll; /* 세로 스크롤 가능 */
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;s
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-x: hidden;

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
`;
const fadeIn = keyframes`
  from {
    opacity: 0; /* 처음에 투명 */
  }
  to {
    opacity: 1; /* 서서히 보이게 */
  }
`;

const ButtonContainer = styled.button`
  display: flex;
  width: 138px;
  padding: 8px 20px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 50px;
  background: #243348;
  box-shadow:
    -1.5px -1.5px 1.5px 0px var(--Color-secondary-navy, #1c2231) inset,
    -3.5px -1.5px 12px 0px var(--Color-secondary-navy, #1c2231) inset;
  margin: 0 auto;
  position: relative;
  top: 12%;
  animation: ${fadeIn} 1.8s ease-out;
  opacity: 0; /* 초기에는 숨김 */
  animation-fill-mode: forwards; /* 애니메이션이 끝난 후 상태 유지 */
`;
const ButtonTxt = styled.div`
  color: var(--color-black-white-white, #fff);
  font-family: var(--Typography-family-body, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.5px;
`;
const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px); /* 아래에서 위로 */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
const Logo = styled.div<Props>`
  width: 170px;
  height: 94px;
  background: ${(props) => `url(${props.img}) no-repeat center center`};
  background-size: contain;
  position: relative;
  margin: 0 auto;
  top: 10%;
  animation: ${fadeInDown} 1.7s ease-out;
  pointer-events: none;
`;

const FirstSection = styled.div<Props>`
  height: 100vh; /* 화면 크기만큼 차지 */
  width: 100vw; /* 화면 크기만큼 차지 */
  background: ${(props) => `url(${props.img}) no-repeat center center`};
  background-size: cover; /* 이미지가 전체 화면을 덮도록 */
  scroll-snap-align: start;
  background-position: center;
`;

const Section = styled.div<Props>`
  height: 92vh; /* 화면 크기만큼 차지 */
  width: 100vw; /* 화면 크기만큼 차지 */
  background: ${(props) => `url(${props.img}) no-repeat center center`};
  background-size: cover; /* 이미지가 전체 화면을 덮도록 */
  scroll-snap-align: start;
  overflow-x: hidden;
`;
const WhiteSection = styled.div<Props>`
  height: 92vh; /* 화면 크기만큼 차지 */
  width: 100vw; /* 화면 크기만큼 차지 */
  background: ${(props) => `url(${props.img}) no-repeat center center`};
  background-size: contain; /* 이미지가 전체 화면을 덮도록 */
  scroll-snap-align: start;
  overflow-x: hidden;
  background-position: center 3.3rem;
`;
