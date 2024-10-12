import styled from "styled-components";
import { WriteOrderList } from "./writeMainList/WriteOrderList";
import Button from "../common/Button";
import { WriteOrderTitle } from "./WriteOrderTitle";
import { useState } from "react";

export type Status = "inactive" | "completed" | "myTurn" | "othersTurn";
export interface WriteOrderItem {
  id: number;
  status: Status;
  profileImageUrl: string;
  name: string;
  title?: string;
  time?: number;
}

const Write = () => {
  const items: WriteOrderItem[] = [
    { id: 1, status: 'completed', profileImageUrl: '/img/profile.png', name: '사용자 이름', title: '제목 텍스트' },
    { id: 2, status: 'othersTurn', profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 15 },
    { id: 3, status: 'myTurn', profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 30 },
    { id: 4, status: 'inactive', profileImageUrl: '/img/profile.png', name: '사용자 이름' },
    { id: 5, status: 'inactive', profileImageUrl: '/img/profile.png', name: '사용자 이름' },
    { id: 6, status: 'completed', profileImageUrl: '/img/profile.png', name: '사용자 이름', title: '제목 텍스트' },
    { id: 7, status: 'othersTurn', profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 15 },
    { id: 8, status: 'completed', profileImageUrl: '/img/profile.png', name: '사용자 이름', title: '제목 텍스트' },
    { id: 9, status: 'othersTurn', profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 15 },
    { id: 10, status: 'inactive', profileImageUrl: '/img/profile.png', name: '사용자 이름' },
    { id: 11, status: 'inactive', profileImageUrl: '/img/profile.png', name: '사용자 이름' },
    { id: 12, status: 'completed', profileImageUrl: '/img/profile.png', name: '사용자 이름', title: '제목 텍스트' },
    { id: 13, status: 'othersTurn', profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 15 },
    { id: 14, status: 'completed', profileImageUrl: '/img/profile.png', name: '사용자 이름', title: '제목 텍스트' },
    { id: 15, status: 'othersTurn', profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 15 },
  ];

  const [nowItemId, setNowItemId] = useState<number | undefined>(undefined);

  const goWritePage = () => {
    handleScrollTo(9)
    setTimeout(() => {
      setNowItemId(undefined);
    }, 1000);
  }

  const handleScrollTo = (id: number) => {
    setNowItemId(id);
  };

  return (
    <Container>
      <StickyHeader>
        <WriteOrderTitle title="선재야 생일축하해" />
      </StickyHeader>
      <ScrollableOrderList>
        <WriteOrderList items={items} nowItemId={nowItemId}/>
      </ScrollableOrderList>
      <StickyFooter>
        <Button text={'편지를 적어주세요'} color={'#FCFFAF'} onClick={goWritePage} />
      </StickyFooter>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px;
  background-color: #212529;
  display: flex;
  flex-direction: column;
`;

const StickyHeader = styled.div`
  position: sticky;
  top: 10px;
  z-index: 4;
`;

const ScrollableOrderList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin: 10px 5px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const StickyFooter = styled.div`
  position: sticky;
  bottom: 10px;
  z-index: 4;
  background-color: transparent;
`;

export default Write;
