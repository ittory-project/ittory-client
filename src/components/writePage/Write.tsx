// src/components/Write.tsx
import styled from "styled-components";
import { WriteOrderList } from "./WriteOrderList";

export const Write = () => {
  const items = [
    { id: 1, status: 'completed' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', title: '제목 텍스트' },
    { id: 2, status: 'othersTurn' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 15 },
    { id: 3, status: 'myTurn' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 30 },
    { id: 4, status: 'inactive' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름' },
    { id: 5, status: 'inactive' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름' },
    { id: 6, status: 'completed' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', title: '제목 텍스트' },
    { id: 7, status: 'othersTurn' as const, profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 15 },
  ];

  return (
    <Container>
      <OrderList items={items} />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 10px;
  background-color: #212529;
`;

const OrderList = styled(WriteOrderList)`
  position: absolute;
  margin: 5px;
`;
