import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import shadow from "../../../public/assets/bookshadow.svg";
import bg from "../../../public/assets/connect/bg.svg";
import book1 from "../../../public/assets/connect/book1.svg";
import book2 from "../../../public/assets/connect/book2.svg";
import book3 from "../../../public/assets/connect/book3.svg";
import book4 from "../../../public/assets/connect/book4.svg";
import book5 from "../../../public/assets/connect/book5.svg";
import { WriteOrder } from "./WriteOrder";
import { useLocation } from "react-router-dom";
import { getLetterInfo } from "../../api/service/LetterService";

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
  const location = useLocation();
  const count = location.state.count;
  const letterId = location.state.letterId;
  const [coverId, setCoverId] = useState<number>(-1);

  useEffect(() => {
    localStorage.removeItem("letterId");

    const fetchMydata = async () => {
      try {
        const data = await getLetterInfo(letterId);
        setCoverId(data.coverTypeId + 1);
      } catch (err) {
        console.error("Error fetching mydata:", err);
      }
    };
    fetchMydata();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimationComplete(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const getBookImage = (coverId: number) => {
    switch (coverId) {
      case 1:
        return book1;
      case 2:
        return book2;
      case 3:
        return book3;
      case 4:
        return book4;
      case 5:
        return book5;
      // 기본적으로 book1을 반환
    }
  };

  const getTopBackground = (coverId: number) => {
    switch (coverId) {
      case 1:
        return "linear-gradient(0deg, #B3DAF2 9.5%, #FBFFCE 100%)"; // Example gradient for coverId 1
      case 2:
        return "linear-gradient(0deg, #87D696 100%, #F0F5BF 100%)"; // Example gradient for coverId 2
      case 3:
        return "linear-gradient(0deg, #e9c46a 9.55%, #f1a208 100%)"; // Example gradient for coverId 3
      case 4:
        return "linear-gradient(0deg, #6a4c93 9.55%, #9b8bb0 100%)"; // Example gradient for coverId 4
      case 5:
        return "linear-gradient(0deg, #f4a261 9.55%, #e76f51 100%)"; // Example gradient for coverId 5
      default:
        return "linear-gradient(0deg, #edefa4 9.55%, #ffcbd8 100%)"; // Default gradient
    }
  };

  const getGroundColor = (coverId: number) => {
    switch (coverId) {
      case 1:
        return "linear-gradient(0deg, #D9F0FF 9.55%, #CEECFF 100%)"; // Example gradient for coverId 1
      case 2:
        return "linear-gradient(0deg, #EAFFF1 9.55%, #ECFFCC 100%)"; // Example gradient for coverId 2
      case 3:
        return "linear-gradient(0deg, #e9c46a 9.55%, #f1a208 100%)"; // Example gradient for coverId 3
      case 4:
        return "linear-gradient(0deg, rgba(242, 245, 163, 0.80) 9.55%, rgba(253, 255, 199, 0.80) 100%)"; // Example gradient for coverId 4
      case 5:
        return "linear-gradient(0deg, rgba(211, 246, 255, 0.80) 9.55%, rgba(228, 249, 255, 0.80) 100%)"; // Example gradient for coverId 5
      default:
        return "linear-gradient(0deg, #edefa4 9.55%, #ffcbd8 100%)"; // Default gradient
    }
  };

  return (
    <>
      {!isAnimationComplete ? (
        <BackGround>
          <Top src={bg} />
          <TopImg src={bg} backgroundColor={getTopBackground(coverId)} />
          <Contents>편지 쓰러 가는 중 . . .</Contents>
          <Book src={getBookImage(coverId)} alt="book" />
          <Shadow src={shadow} alt="shadow" />
          <Ground groundColor={getGroundColor(coverId)} />
        </BackGround>
      ) : (
        <WriteOrder count={count} letterId={letterId} />
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
const Top = styled.img`
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
const Ground = styled.div<{ groundColor: string }>`
  z-index: 1;
  position: absolute;
  bottom: 0;
  width: 100vw;
  height: 40%;
  flex-shrink: 0;
  background: ${(props) => props.groundColor};
`;
const TopImg = styled.img<{ backgroundColor: string }>`
  z-index: 1;
  position: absolute;
  top: 0;
  width: 100vw;
  height: 60%;
  flex-shrink: 0;
  background: ${(props) => props.backgroundColor};
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
