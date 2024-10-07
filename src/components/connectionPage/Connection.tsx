import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import book from "../../../public/assets/trianglebook.svg";
import shadow from "../../../public/assets/bookshadow.svg";
import bg from "../../../public/assets/bg.svg";
import { WriteOrder } from "./WriteOrder";

//커버스타일 테두리 수정
//초대수락->생성된 편지로 어떻게 넘어가는지 알아보기
//구체적 애니메이션

const scaleAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(19.8);
  }
`;

const hideDuringAnimation = keyframes`
  0%{
    opacity: 1;
  }
  30%, 60%, 100%  {
    opacity: 0; 
  }
`;

export const Connection = () => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimationComplete(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!isAnimationComplete ? (
        <BackGround>
          <Top src={bg} />
          <TopImg src={bg} />
          <Contents>편지 쓰러 가는 중 . . .</Contents>
          <Book src={book} alt="book" />
          <Shadow src={shadow} alt="shadow" />
          <Ground />
        </BackGround>
      ) : (
        <WriteOrder />
      )}
    </>
  );
};

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;
const Book = styled.img`
  width: 154px;
  height: 83px;
  flex-shrink: 0;
  position: absolute;
  bottom: 39.7%;
  z-index: 2;
  animation: ${scaleAnimation} 1.2s ease-in-out;
  animation-delay: 1.6s;
`;
const Shadow = styled.img`
  width: 350px;
  height: 124px;
  flex-shrink: 0;
  position: absolute;
  top: 59.3%;
  z-index: 2;
  animation: ${hideDuringAnimation} 1.2s ease-in-out;
  animation-delay: 1.6s;
`;
//커버 종류에 따라 background 색 달라짐
const Top = styled.div`
  z-index: 1;
  position: absolute;
  top: 0;
  width: 100vw;
  height: 60%;
  flex-shrink: 0;
  background: linear-gradient(0deg, #edefa4 9.55%, #ffcbd8 100%);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;
const Ground = styled.div`
  z-index: 1;
  position: absolute;
  bottom: 0;
  width: 100vw;
  height: 40%;
  flex-shrink: 0;
  background: linear-gradient(0deg, #f1f4a7 9.55%, #fdffc7 100%);
`;
const TopImg = styled.div`
  z-index: 1;
  position: absolute;
  top: 0;
  width: 100vw;
  height: 60%;
  flex-shrink: 0;
  background: url(${bg}) lightgray -171.556px -3.988px / 190% 102.09% no-repeat;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.8;
  mix-blend-mode: luminosity;
`;
const Contents = styled.div`
  margin-top: 55%;
  z-index: 2;
  display: inline-flex;
  padding: var(--Border-Radius-radius_300, 8px) 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  text-align: center;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: -0.5px;
  animation: ${hideDuringAnimation} 2s ease-in-out;
  animation-delay: 1s;
`;

/*
const WriteOrderContainer = styled.div`
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: opacity 1s ease-in-out;
`;*/
