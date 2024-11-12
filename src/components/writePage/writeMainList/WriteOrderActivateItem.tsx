import React, { useState } from 'react';
import styled from 'styled-components';
import { getUserId } from '../../../api/config/setToken';

interface WriteOrderProps {
  profileImageUrl: string | undefined;
  name: string;
  title?: string;
  itemId: number;
  time?: number;
}

// 현재 순서이거나(myTurn/othersTurn), 지나간 순서(completed) 상태 아이템
export const WriteOrderActivateItem: React.FC<WriteOrderProps> = ({ profileImageUrl, name, title, itemId, time }) => {
  // [TODO]: 이 아이템의 유저 아이디와 내 아이디가 일치하는지 확인할 수 있게 하기 - 이걸 그냥 상위에서 끝내버리면 더 편할 것 같다..?
  const [letterStatus, setLetterStatus] = useState<'completed' | 'myTurn' | 'othersTurn'>('othersTurn')
  const userId = getUserId()

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = "/img/profile.png";
  };

  return userId && (
    <Wrapper status={letterStatus}>
      <ProfileImage src={""+profileImageUrl} onError={handleImageError} />
      <ContentWrapper>
        { !title && Number(getUserId()) === 4 && (
          <MyTurn>
            <MainText>내 차례예요</MainText>
            <ClockText>
              <ClockIcon src="/assets/write/clock.svg" />
              {Math.floor(Number(time))}초
            </ClockText>
          </MyTurn>
        )}
        { title && (
          <>
            <MainText>{title}</MainText>
            <SubText>
              <LetterNum>{itemId}</LetterNum>
              {name}
            </SubText>
          </>
        )}
        { !title && Number(getUserId()) !== 4 && (
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
  display: flex;
  font-size: 14px;
  color: #868e96;
`;

const LetterNum = styled.div`
  display: flex;
  width: 16px;
  height: 16px;
  padding: 1.6px 1.6px;
  margin: 0px 3px 0px 0px;
  justify-content: center;
  align-items: center;
  gap: var(--Border-Radius-radius_300, 8px);
  border-radius: 40px;
  background: var(--Color-grayscale-gray800, #343A40);
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