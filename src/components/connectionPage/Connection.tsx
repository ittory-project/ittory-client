import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled, { keyframes } from "styled-components";
import shadow from "../../../public/assets/bookshadow.svg";
import book1 from "../../../public/assets/connect/book1.svg";
import book2 from "../../../public/assets/connect/book2.svg";
import book3 from "../../../public/assets/connect/book3.svg";
import book4 from "../../../public/assets/connect/book4.svg";
import book5 from "../../../public/assets/connect/book5.svg";
import bg1 from "../../../public/assets/connect/bg1.svg";
import bg2 from "../../../public/assets/connect/bg2.svg";
import bg3 from "../../../public/assets/connect/bg3.svg";
import bg4 from "../../../public/assets/connect/bg4.svg";
import bg5 from "../../../public/assets/connect/bg5.svg";
import { WriteOrder } from "./WriteOrder";
import { clearData, clearOrderData } from "../../api/config/state";
import { encodeLetterId } from "../../api/config/base64";
import { postRandom } from "../../api/service/ParticipantService";

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
  const [isAnimationComplete, setIsAnimationComplete] =
    useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const letterId = location.state.letterId;
  const coverId = location.state.coverId;
  const [bookImage, setBookImage] = useState<string | undefined>();
  const [topBackground, setTopBackground] = useState<string | undefined>();
  const [groundColor, setGroundColor] = useState<string | undefined>();

  console.log(coverId);

  useEffect(() => {
    localStorage.removeItem("letterId");
    dispatch(clearOrderData());
    dispatch(clearData());
    window.localStorage.setItem("nowLetterId", "1");
    window.localStorage.setItem("nowSequence", "1");
    window.localStorage.setItem("nowRepeat", "1");
    window.localStorage.setItem("totalItem", "1");
    window.localStorage.setItem("resetTime", "");

    const postRandomParti = async () => {
      try {
        const data = await postRandom({
          letterId: letterId,
        });
        console.log("순서설정:", data);
      } catch (err) {
        console.error("Error fetching mydata:", err);
      }
    };

    postRandomParti();
  }, []);

  useEffect(() => {
    const routingTimer = setTimeout(() => {
      navigate(`/write/${encodeLetterId(letterId)}`);
    }, 2500);

    return () => clearTimeout(routingTimer);
  }, [navigate, letterId]);

  useEffect(() => {
    switch (coverId) {
      case 1:
        setBookImage(book1);
        setTopBackground(bg1);
        setGroundColor("linear-gradient(0deg, #D9F0FF 9.55%, #CEECFF 100%)");
        break;
      case 2:
        setBookImage(book2);
        setTopBackground(bg2);
        setGroundColor("linear-gradient(0deg, #EAFFF1 9.55%, #ECFFCC 100%)");
        break;
      case 3:
        setBookImage(book3);
        setTopBackground(bg3);
        setGroundColor(
          "linear-gradient(0deg, rgba(241, 244, 167, 0.80) 9.55%, rgba(253, 255, 199, 0.80) 100%);"
        );
        break;
      case 4:
        setBookImage(book4);
        setTopBackground(bg4);
        setGroundColor(
          "linear-gradient(0deg, rgba(242, 245, 163, 0.80) 9.55%, rgba(253, 255, 199, 0.80) 100%)"
        );
        break;
      case 5:
        setBookImage(book5);
        setTopBackground(bg5);
        setGroundColor(
          "linear-gradient(0deg, rgba(211, 246, 255, 0.80) 9.55%, rgba(228, 249, 255, 0.80) 100%)"
        );
        break;
      default:
        setBookImage(undefined);
        setTopBackground(undefined);
        setGroundColor(undefined);
    }
  }, [coverId]);

  console.log(coverId);

  return (
    <>
      {!isAnimationComplete ? (
        <BackGround>
          <TopImg src={topBackground} />
          <Contents>편지 쓰러 가는 중 . . .</Contents>
          <Book src={bookImage} alt="book" />
          <Shadow src={shadow} alt="shadow" />
          <Ground $groundColor={String(groundColor)} />
        </BackGround>
      ) : (
        <WriteOrder letterId={letterId} />
      )}
    </>
  );
};

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(var(--vh, 1vh) * 100);
  width: 100%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
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
const Ground = styled.div<{ $groundColor: string }>`
  z-index: 1;
  position: absolute;
  bottom: 0;
  width: 100vw;
  height: 40vh;
  flex-shrink: 0;
  background: ${(props) => props.$groundColor};
  object-fit: cover;
`;
const TopImg = styled.img`
  z-index: 1;
  position: absolute;
  top: 0;
  width: 101%;
  height: 60vh;
  flex-shrink: 0;
  overflow: hidden;
  object-fit: cover;
`;
const Contents = styled.div`
  position: absolute;
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
