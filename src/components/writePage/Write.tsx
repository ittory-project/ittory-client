import styled from "styled-components";
import { WriteOrderList } from "./writeMainList/WriteOrderList";
import Button from "../common/Button";
import { WriteOrderTitle } from "./WriteOrderTitle";

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
    { id: 10, status: 'myTurn', profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 30 },
    { id: 11, status: 'inactive', profileImageUrl: '/img/profile.png', name: '사용자 이름' },
    { id: 12, status: 'inactive', profileImageUrl: '/img/profile.png', name: '사용자 이름' },
    { id: 13, status: 'completed', profileImageUrl: '/img/profile.png', name: '사용자 이름', title: '제목 텍스트' },
    { id: 14, status: 'othersTurn', profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 15 },
    { id: 15, status: 'completed', profileImageUrl: '/img/profile.png', name: '사용자 이름', title: '제목 텍스트' },
    { id: 16, status: 'othersTurn', profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 15 },
    { id: 17, status: 'myTurn', profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 30 },
    { id: 18, status: 'inactive', profileImageUrl: '/img/profile.png', name: '사용자 이름' },
    { id: 19, status: 'inactive', profileImageUrl: '/img/profile.png', name: '사용자 이름' },
    { id: 20, status: 'completed', profileImageUrl: '/img/profile.png', name: '사용자 이름', title: '제목 텍스트' },
    { id: 21, status: 'othersTurn', profileImageUrl: '/img/profile.png', name: '사용자 이름', time: 15 }
  ];

  const goWritePage = () => {
    console.log('click');
  }

  return (
    <Container>
      <StickyHeader>
        <WriteOrderTitle title="선재야 생일축하해" />
      </StickyHeader>
      <ScrollableOrderList>
        <WriteOrderList items={items} />
      </ScrollableOrderList>
      <StickyFooter>
        <ButtonWrapper>
          <Button text={'편지를 적어주세요'} color={'#FCFFAF'} onClick={goWritePage} />
        </ButtonWrapper>
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
  top: 5px;
  z-index: 4;
  background-color: #212529;
`;

const ScrollableOrderList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin: 10px 5px;
`;

const StickyFooter = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 4;
  padding-bottom: 10px;
`;

const ButtonWrapper = styled.div`
  width: 90%;
  display: flex;
  margin: 0 auto;
`;

export default Write;
