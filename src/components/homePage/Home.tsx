import React, { useState, useEffect, ReactNode } from "react";
import styled from "styled-components";
import bgimg from "../../../public/assets/home/homebg.svg";

interface BackGroundProps {
  bgimg: string;
}

export const Home = () => {
  return (
    <Container>
      <FirstSection bgimg={bgimg} />
      <Section bgimg={bgimg} />
      <Section bgimg={bgimg} />
      <Section bgimg={bgimg} />
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow-y: scroll; /* 세로 스크롤 가능 */
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-x: hidden;

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const FirstSection = styled.div<BackGroundProps>`
  height: 100vh; /* 화면 크기만큼 차지 */
  width: 100vw; /* 화면 크기만큼 차지 */
  background: ${(props) => `url(${props.bgimg}) no-repeat center center`};
  background-size: cover; /* 이미지가 전체 화면을 덮도록 */
  scroll-snap-align: start;
  background-position: right center;
`;

const Section = styled.div<BackGroundProps>`
  height: 93vh; /* 화면 크기만큼 차지 */
  width: 100vw; /* 화면 크기만큼 차지 */
  background: ${(props) => `url(${props.bgimg}) no-repeat center center`};
  background-size: cover; /* 이미지가 전체 화면을 덮도록 */
  scroll-snap-align: start;
  overflow-x: hidden;
  background-position: right center;
`;
