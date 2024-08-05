import styled from "styled-components";
import { WriteOrderList } from "./writeMainList/WriteOrderList";
import Button from "../common/Button";
import { WriteOrderTitle } from "./WriteOrderTitle";

export const Write = () => {
  const items = [
    { id: 1, status: 'completed' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', title: '제목 텍스트' },
    { id: 2, status: 'othersTurn' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 15 },
    { id: 3, status: 'myTurn' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 30 },
    { id: 4, status: 'inactive' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름' },
    { id: 5, status: 'inactive' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름' },
    { id: 6, status: 'completed' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', title: '제목 텍스트' },
    { id: 7, status: 'othersTurn' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 15 },
    { id: 8, status: 'completed' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', title: '제목 텍스트' },
    { id: 9, status: 'othersTurn' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 15 },
    { id: 10, status: 'myTurn' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 30 },
    { id: 11, status: 'inactive' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름' },
    { id: 12, status: 'inactive' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름' },
    { id: 13, status: 'completed' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', title: '제목 텍스트' },
    { id: 14, status: 'othersTurn' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 15 },
    { id: 15, status: 'completed' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', title: '제목 텍스트' },
    { id: 16, status: 'othersTurn' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 15 },
    { id: 17, status: 'myTurn' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 30 },
    { id: 18, status: 'inactive' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름' },
    { id: 19, status: 'inactive' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름' },
    { id: 20, status: 'completed' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', title: '제목 텍스트' },
    { id: 21, status: 'othersTurn' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 15 },
  ];

  const goWritePage = () => {
    console.log('click');
  }

  return (
    <Container>
      <WriteOrderTitle title="선재야 생일축하해" />
      <OrderList items={items} />
      <ButtonContainer>
        <ButtonWrapper>
          <Button text={'편지를 적어주세요'} color={'#FCFFAF'} onClick={goWritePage} />
        </ButtonWrapper>
      </ButtonContainer>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px;
  background-color: #212529;
`;

const OrderList = styled(WriteOrderList)`
  position: absolute;
  margin: 5px;
`;

const ButtonContainer = styled.div`
  width: 100%;
`;

const ButtonWrapper = styled.div`
  width: 90%;
  display: flex;
  z-index: 2;
  margin: 0 auto;
`;