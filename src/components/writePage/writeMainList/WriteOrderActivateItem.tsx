import React from 'react';
import styled from 'styled-components';

interface WriteOrderProps {
  status: 'completed' | 'myTurn' | 'othersTurn';
  profileImageUrl: string;
  name: string;
  title?: string;
  time?: number;
}

export const WriteOrderActivateItem: React.FC<WriteOrderProps> = ({ status, profileImageUrl, name, title, time }) => {
  return (
    <Wrapper status={status}>
      <ProfileImage src={""+profileImageUrl} />
      <ContentWrapper>
        {status === 'myTurn' && (
          <MyTurn>
            <MainText>내 차례예요</MainText>
            <SubText>{time}초</SubText>
          </MyTurn>
        )}
        {status === 'completed' && (
          <>
            <MainText>{title}</MainText>
            <SubText>{name}</SubText>
          </>
        )}
        {status === 'othersTurn' && (
          <>
            <MainTextWriting>편지를 작성하고 있어요...</MainTextWriting>
            <SubText>{time}초</SubText>
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
    ? '1px solid #FCFFAF; border-radius: 5px; background: linear-gradient(160deg, #425166, #243348 95%); padding: 20px 10px;' : '')};
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
