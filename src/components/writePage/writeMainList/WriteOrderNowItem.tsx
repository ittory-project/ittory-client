import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getUserId } from '../../../api/config/setToken';

interface WriteOrderProps {
  profileImageUrl: string | undefined;
  nowUserId: number
  time: number;
}

// 현재 순서(myTurn/othersTurn) 아이템
export const WriteOrderNowItem: React.FC<WriteOrderProps> = ({ profileImageUrl, nowUserId, time }) => {
  const [letterStatus, setLetterStatus] = useState<'myTurn' | 'othersTurn'>('othersTurn')
  const userId = getUserId() || 0

  useEffect(() => {
    console.log(`설정을 하긴 하는거냐? ${userId}, ${nowUserId}`)
    if (userId === nowUserId) {
      setLetterStatus('myTurn')
    } else {
      setLetterStatus('othersTurn')
    }
  }, [userId, nowUserId])

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = "/img/profile.png";
  };

  return userId && (
    <Wrapper status={letterStatus}>
      <ProfileImage src={""+profileImageUrl} onError={handleImageError} />
      <ContentWrapper>
        { letterStatus === 'myTurn' && (
          <MyTurn>
            <MainText>내 차례예요</MainText>
            <ClockText>
              <ClockIcon src="/assets/write/clock.svg" />
              {Math.floor(Number(time))}초
            </ClockText>
          </MyTurn>
        )}
        { letterStatus === 'othersTurn' && (
          <>
            <MainTextWriting>편지를 작성하고 있어요...</MainTextWriting>
            <ClockText>
              <ClockIcon src="/assets/write/clock.svg" />
                {Math.floor(Number(time))}초
            </ClockText>
          </>
        )}
      </ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div<{status: 'myTurn' | 'othersTurn'}>`
  display: flex;
  align-items: center;
  margin: 20px 0;
  padding: 10px;
  border: ${(props) => (
    props.status === 'myTurn' 
    ? '1px solid #FCFFAF; border-radius: 5px; background: linear-gradient(160deg, #425166, #1C2231 95%); padding: 20px 10px;' : '')};
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 5px;
  border: 1px solid white;
  margin-right: 10px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const MyTurn = styled.div`
  border-radius: 5px;
`;

const MainText = styled.div`
  font-size: 16px;
  color: #ffffff;
`;

const MainTextWriting = styled(MainText)`
  color: #868e96;
`;

const ClockIcon = styled.img`
  display: flex;
  width: 12px;
  height: 13px;
  margin: 1px 5px 0px 0px;
  justify-content: center;
  align-items: center;
`;

const ClockText = styled.div`
  margin: 2px 0px 0px 0px;
  display: flex;
  color: var(--Color-primary-orange, #FFA256);
  font-size: var(--Typography-size-s, 11px);
  font-style: normal;
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;