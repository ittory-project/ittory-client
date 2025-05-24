import React, { useState } from 'react';

import styled from 'styled-components';

import blue from '../../../public/assets/bluecircle.svg';
import gray from '../../../public/assets/graycircle.svg';
import guide1 from '../../../public/assets/guide1.svg';
import guide2 from '../../../public/assets/guide2.svg';
import guide3 from '../../../public/assets/guide3.svg';
import guide4 from '../../../public/assets/guide4.svg';
import guide5 from '../../../public/assets/guide5.svg';
import guide6 from '../../../public/assets/guide6.svg';

interface Props {
  setGuide: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserGuide = ({ setGuide }: Props) => {
  const guides = [guide1, guide2, guide3, guide4, guide5, guide6];
  const descriptions = [
    '방장이 편지를\n몇 번 이어 쓸 지 정해요',
    '편지 작성 순서는\n랜덤으로 정해져요',
    '100초 안에 앞 내용과 그림을 보고\n편지를 적어 주세요',
    '위치 버튼을 누르면,\n현재 작성 중인 곳으로 이동해요',
    '시간 내에 편지를 적지 못하면\n다음 사람이 이어가게 돼요',
    '2번 이상 편지를 적지 않으면\n자동 퇴장되어 다시 참여할 수 없어요',
  ];
  const numbers = [0, 1, 2, 3, 4, 5];
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
          <PrevButton onClick={handlePrevImage} $disabled={currentIndex === 0}>
            이전
          </PrevButton>
          <BubbleContainer>
            {numbers.map((number, index) =>
              number === currentIndex ? (
                <Blue key={index} src={blue} />
              ) : (
                <Gray key={index} src={gray} />
              ),
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
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 100;

  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  gap: 24px;
  align-items: center;

  width: 272px;

  padding: 24px 0px 16px 0px;

  background: #fff;
  border: 3px solid #d3edff;
  border-radius: 20px;

  transform: translate(-50%, -50%);
`;
const MainContainer = styled.div`
  display: flex;

  flex-direction: column;

  gap: 24px;
  align-items: center;
  align-self: stretch;
`;
const GuideImage = styled.img`
  display: block;

  flex-direction: column;

  gap: 16px;

  width: 232px;
  height: 210px;

  object-fit: cover;

  border-radius: 16px;
`;
const Description = styled.div`
  display: flex;

  flex-direction: column;

  gap: 8px;
  align-items: center;
  align-self: stretch;

  font-family: SUIT;
  font-size: 16px;
  font-weight: 700;

  line-height: 22px;

  color: #212529;

  text-align: center;
  letter-spacing: -0.5px;
  white-space: pre-line;
`;
const ButtonContainer = styled.div`
  box-sizing: border-box;
  display: flex;

  align-items: center;
  align-self: stretch;
  justify-content: space-between;

  padding: 0px 16px;
`;
const BubbleContainer = styled.div`
  display: flex;

  gap: 4px;
  align-items: center;
`;
const Blue = styled.img`
  width: 18px;
  height: 6px;
`;
const Gray = styled.img`
  width: 6px;
  height: 6px;
`;
const PrevButton = styled.div<{ $disabled: boolean }>`
  box-sizing: border-box;
  display: flex;

  gap: 10px;
  align-items: center;
  justify-content: center;

  padding: 8px;

  font-family: SUIT;
  font-size: 12px;
  font-weight: 700;

  line-height: 16px;

  color: ${(props) => (props.$disabled ? '#ADB5BD' : '#495057')};

  text-align: center;
  letter-spacing: -0.5px;

  cursor: pointer;
  cursor: pointer;
`;
const NextButton = styled.div`
  box-sizing: border-box;
  display: flex;

  gap: 10px;
  align-items: center;
  justify-content: center;

  padding: 8px;

  font-family: SUIT;
  font-size: 12px;
  font-weight: 700;

  line-height: 16px;

  color: #495057;

  text-align: center;
  letter-spacing: -0.5px;

  cursor: pointer;
`;
const CompleteButton = styled.div`
  box-sizing: border-box;
  display: flex;

  gap: 10px;
  align-items: center;
  justify-content: center;

  padding: 8px;

  font-family: SUIT;
  font-size: 12px;
  font-weight: 700;

  line-height: 16px;

  color: #4db4ff;

  text-align: center;
  letter-spacing: -0.5px;

  cursor: pointer;
`;
