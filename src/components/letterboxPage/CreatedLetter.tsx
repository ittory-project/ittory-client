import React, { useState, useEffect } from "react";
import styled from "styled-components";
import more from "../../../public/assets/more.svg";
import book1 from "../../../public/assets/book_mini_yellow.svg";
import book2 from "../../../public/assets/book_mini_green.svg";
import book3 from "../../../public/assets/book_mini_blue.svg";
import book4 from "../../../public/assets/book_mini_pink.svg";
import { Created_Modal } from "./Created_Modal";
import { DeletePopup } from "./DeletePopup";
import { EmptyLetter } from "./EmptyLetter";
import { Letter } from "./Letter";
import {
  getParticipatedLetter,
  getLetterCounts,
} from "../../api/service/MemberService";

export interface GroupItem {
  id: number;
  name: string;
  bookcover: string;
}

interface Props {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenLetter: React.Dispatch<React.SetStateAction<boolean>>;
  popup: boolean;
  openLetter: boolean;
}

export const CreatedLetter = ({
  setIsModalOpen,
  isModalOpen,
  setPopup,
  popup,
  setOpenLetter,
  openLetter,
}: Props) => {
  const [items, setItems] = useState<GroupItem[]>([
    { id: 16, name: "일이삼사오육칠팔구", bookcover: book1 },
    { id: 17, name: "일이삼사오육칠팔구", bookcover: book2 },
    { id: 18, name: "일이삼사오육칠팔구", bookcover: book3 },
    { id: 4, name: "일이삼사오육칠팔구", bookcover: book4 },
    { id: 5, name: "일이삼사오육칠팔구", bookcover: book2 },
  ]);

  const [deleteAlert, setDeleteAlert] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [letterCounts, setLetterCounts] = useState<number>(0);

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const letters = await getParticipatedLetter();
        const counts = await getLetterCounts();
        setLetterCounts(counts.participationLetterCount);
        console.log(letters);
      } catch (err) {
        console.error("Error fetching letter counts:", err);
      }
    };

    fetchLetter();
  }, []);

  const getBackgroundColor = (bookcover: string) => {
    switch (bookcover) {
      case book1:
        return "#FFF6E4"; // Yellow
      case book2:
        return "#ECFFE1"; // Green
      case book3:
        return "#E3F8FF"; // Blue
      case book4:
        return "#FFEFF1"; // Pink
      default:
        return "#FFFFFF"; // Default color
    }
  };

  const openModal = (itemId: number) => {
    setItemToDelete(itemId);
    setIsModalOpen(true);
  };

  const handleLetter = (itemId: number) => {
    setItemToDelete(itemId);
    setOpenLetter(true);
  };

  const handleDelete = () => {
    if (itemToDelete !== null) {
      setItems(items.filter((item) => item.id !== itemToDelete));
      setDeleteAlert("편지가 삭제되었어요");
      setItemToDelete(null);
    }
    setTimeout(() => {
      setDeleteAlert(null);
    }, 5000);
    // 5초 후에 alert 메시지를 숨기기
  };

  return (
    <>
      {items.length === 0 ? (
        <EmptyLetter context="created" />
      ) : (
        <>
          {!popup && !openLetter && (
            <Container>
              {deleteAlert && <DeleteAlert>{deleteAlert}</DeleteAlert>}
              <NumberHeader>
                <NumberTxt style={{ fontWeight: "400", marginRight: "2.5px" }}>
                  총
                </NumberTxt>
                <NumberTxt style={{ fontWeight: "700" }}>
                  {letterCounts}
                </NumberTxt>
                <NumberTxt style={{ fontWeight: "400" }}>개</NumberTxt>
              </NumberHeader>
              {items.map((item) => (
                <LetterContainer
                  key={item.id}
                  bgColor={getBackgroundColor(item.bookcover)}
                >
                  <BookCover src={item.bookcover} alt={item.name} />
                  <Content
                    onClick={() => {
                      setDeleteName(item.name);
                      handleLetter(item.id);
                    }}
                  >
                    <BookName>To. {item.name}</BookName>
                    <DeliverDay>2024. 08. 21 전달</DeliverDay>
                  </Content>
                  <MoreButton
                    src={more}
                    alt="more_btn"
                    onClick={() => {
                      setDeleteName(item.name);
                      openModal(item.id);
                    }}
                  />
                </LetterContainer>
              ))}
              {isModalOpen && (
                <Created_Modal
                  setIsModalOpen={setIsModalOpen}
                  setPopup={setPopup}
                />
              )}
            </Container>
          )}
          {popup && (
            <DeletePopup
              setOpenLetter={setOpenLetter}
              setPopup={setPopup}
              onDelete={handleDelete}
              setIsModalOpen={setIsModalOpen}
              context="created"
              deleteItem={deleteName}
            />
          )}
          {openLetter && (
            <Letter
              setOpenLetter={setOpenLetter}
              context="created"
              isModalOpen={isModalOpen}
              setPopup={setPopup}
              popup={popup}
              onDelete={handleDelete}
              deleteItem={deleteName}
              setIsModalOpen={setIsModalOpen}
            />
          )}
        </>
      )}
    </>
  );
};

const DeleteAlert = styled.div`
  display: flex;
  padding: var(--Border-Radius-radius_300, 8px) 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  z-index: 100;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  text-align: center;
  font-family: SUIT;
  font-weight: 500;
  font-size: 12px;
  font-style: normal;
  line-height: 16px;
  letter-spacing: -0.5px;
  position: absolute;
  left: 50%;
  bottom: 32px;
  transform: translateX(-50%);
`;
const Container = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 0px 16px;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
`;
const NumberHeader = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 16px 0px;
  align-items: flex-start;
  align-self: stretch;
`;
const NumberTxt = styled.span`
  color: #212529;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
const LetterContainer = styled.div<{ bgColor: string }>`
  display: flex;
  width: 100%;
  margin-bottom: 16px;
  box-sizing: border-box;
  padding: 20px 16px;
  align-items: flex-start;
  gap: 12px;
  border-radius: 12px;
  background-color: ${(props) => props.bgColor};
`;

const BookCover = styled.img`
  width: 36px;
  object-fit: cover;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
const BookName = styled.div`
  flex: 1 0 0;
  color: #212529;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.5px;
  margin-bottom: 4px;
`;
const DeliverDay = styled.div`
  color: #868e96;
  font-family: SUIT;
  font-size: 11px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
const MoreButton = styled.img`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;
