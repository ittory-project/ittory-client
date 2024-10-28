import React, { useState } from 'react';
import styled from 'styled-components';

interface WriteOrderProps {
  profileImageUrl: string;
  name: string;
  title?: string;
  time?: number;
}

// 현재 순서이거나(myTurn/othersTurn), 지나간 순서(completed) 상태 아이템
export const WriteOrderActivateItem: React.FC<WriteOrderProps> = ({ profileImageUrl, name, title, time }) => {
  // [TODO]: 이 아이템의 유저 아이디와 내 아이디가 일치하는지 확인할 수 있게 하기 - 이걸 그냥 상위에서 끝내버리면 더 편할 것 같다..?
  const [letterStatus, setLetterStatus] = useState<'completed' | 'myTurn' | 'othersTurn'>('othersTurn')
  
  return (
    <Wrapper status={letterStatus}>
      <ProfileImage src={""+profileImageUrl} />
      <ContentWrapper>
        {letterStatus === 'myTurn' && (
          <MyTurn>
            <MainText>내 차례예요</MainText>
            <ClockText>
              <ClockIcon src="/assets/write/clock.svg" />
              {Math.floor(Number(time))}초
            </ClockText>
          </MyTurn>
        )}
        {letterStatus === 'completed' && (
          <>
            <MainText>{title}</MainText>
            <SubText>{name}</SubText>
          </>
        )}
        {letterStatus === 'othersTurn' && (
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

const Wrapper = styled.div<{status: 'completed' | 'myTurn' | 'othersTurn'}>`
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

const SubText = styled.div`
  font-size: 14px;
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