import React from 'react';

import styled from 'styled-components';

import clock from '@/assets/write/clock.svg';
import imgError from '@/assets/write/img_error.svg';

import { ElementResponse } from '../../../api/model/ElementModel';
import { useTimeLeft } from '../../../hooks/useTimeLeft';

interface WriteOrderProps {
  isMyTurnToWrite: boolean;
  element: ElementResponse;
}

// 현재 순서(myTurn/othersTurn) 아이템
export const WriteOrderNowItem: React.FC<WriteOrderProps> = ({
  isMyTurnToWrite,
  element,
}) => {
  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    event.currentTarget.src = imgError;
  };

  const timeLeft = useTimeLeft(element.startedAt);

  return (
    <Wrapper $isMyTurnToWrite={isMyTurnToWrite}>
      <LetterImage src={element.imageUrl} onError={handleImageError} />
      <ContentWrapper>
        {isMyTurnToWrite ? (
          <MyTurn>
            <MainText>내 차례예요</MainText>
            <ClockText>
              <ClockIcon src={clock} />
              {Math.floor(Number(timeLeft))}초
            </ClockText>
          </MyTurn>
        ) : (
          <>
            <MainTextWriting>편지를 작성하고 있어요...</MainTextWriting>
            <ClockText>
              <ClockIcon src={clock} />
              {Math.floor(Number(timeLeft))}초
            </ClockText>
          </>
        )}
      </ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ $isMyTurnToWrite: boolean }>`
  display: flex;

  align-items: center;

  padding: 10px;
  margin: 20px 0;

  border: ${(props) =>
    props.$isMyTurnToWrite
      ? '1px solid #FCFFAF; border-radius: 5px; background: linear-gradient(160deg, #425166, #1C2231 95%); padding: 20px 10px;'
      : ''};
`;

const LetterImage = styled.img`
  width: 40px;
  height: 40px;

  margin-right: 10px;

  border: 1px solid white;
  border-radius: 5px;
`;

const ContentWrapper = styled.div`
  display: flex;

  flex-direction: column;
`;

const MyTurn = styled.div`
  border-radius: 5px;
`;

const MainText = styled.div`
  font-size: 18px;

  color: #ffffff;
`;

const MainTextWriting = styled(MainText)`
  color: #868e96;
`;

const ClockIcon = styled.img`
  display: flex;

  align-items: center;
  justify-content: center;

  width: 12px;
  height: 13px;

  margin: 1px 5px 0px 0px;
`;

const ClockText = styled.div`
  display: flex;

  margin: 2px 0px 0px 0px;

  font-size: var(--Typography-size-s, 11px);
  font-style: normal;

  color: var(--Color-primary-orange, #ffa256);

  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;
