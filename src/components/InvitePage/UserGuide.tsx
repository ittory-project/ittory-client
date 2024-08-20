import React, { useEffect, useState } from "react";
import styled from "styled-components";
import guide1 from "../../../public/assets/guide1.svg";
import guide2 from "../../../public/assets/guide2.svg";
import guide3 from "../../../public/assets/guide3.svg";
import guide4 from "../../../public/assets/guide4.svg";
import guide5 from "../../../public/assets/guide5.svg";
import gray from "../../../public/assets/graycircle.svg";
import blue from "../../../public/assets/bluecircle.svg";

interface Props {
  setGuide: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserGuide = ({ setGuide }: Props) => {
  const guides = [guide1, guide2, guide3, guide4, guide5];

  const descriptions = [
    "방장이 편지를\n몇 번 이어 쓸 지 정해요",
    "편지 작성 순서는\n랜덤으로 정해져요",
    "100초 안에 앞 내용과 그림을 보고\n편지를 적어 주세요",
    "위치 버튼을 누르면,\n현재 작성 중인 곳으로 이동해요",
    "퇴장하면 다시 참여할 수 없고,\n다음 사람이 이어가게 돼요",
  ];
  const numbers = [0, 1, 2, 3, 4];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (currentIndex < guides.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleComplete = () => {
    setGuide(false);
  };

  return (
    <ModalContainer>
      <MainContainer>
        <GuideImage
          src={guides[currentIndex]}
          alt={`Guide ${currentIndex + 1}`}
        />
        <Description>{descriptions[currentIndex]}</Description>
        <ButtonContainer>
          <PrevButton onClick={handlePrevImage} disabled={currentIndex === 0}>
            이전
          </PrevButton>
          <BubbleContainer>
            {numbers.map((number) =>
              number === currentIndex ? (
                <Blue src={blue} />
              ) : (
                <Gray src={gray} />
              )
            )}
          </BubbleContainer>
          {currentIndex < guides.length - 1 ? (
            <NextButton onClick={handleNextImage}>다음</NextButton>
          ) : (
            <CompleteButton onClick={handleComplete}>완료</CompleteButton>
          )}
        </ButtonContainer>
      </MainContainer>
    </ModalContainer>
  );
};

const ModalContainer = styled.div`
  display: flex;
  width: 272px;
  height: 25rem;
  box-sizing: border-box;
  padding: 24px 0px 16px 0px;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  border: 3px solid #d3edff;
  background: #fff;
  z-index: 100;
`;
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  align-self: stretch;
`;
const GuideImage = styled.img`
  display: flex;
  width: 232px;
  height: 210px;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  border-radius: 16px;
`;
const Description = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  color: #212529;
  text-align: center;
  font-family: SUIT;
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;
  letter-spacing: -0.5px;
  white-space: pre-line;
  margin-top: 0.3rem;
`;
const ButtonContainer = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 0px 16px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  margin-top: 1.3rem;
`;
const BubbleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
const Blue = styled.img`
  width: 18px;
  height: 6px;
`;
const Gray = styled.img`
  width: 6px;
  height: 6px;
`;
const PrevButton = styled.div<{ disabled: boolean }>`
  display: flex;
  box-sizing: border-box;
  padding: 8px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: ${(props) => (props.disabled ? "#ADB5BD" : "#495057")};
  text-align: center;
  font-family: SUIT;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: -0.5px;
  cursor: pointer;
`;
const NextButton = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 8px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  text-align: center;
  font-family: SUIT;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: -0.5px;
  color: #495057;
`;
const CompleteButton = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 8px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: #4db4ff;
  text-align: center;
  font-family: SUIT;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
