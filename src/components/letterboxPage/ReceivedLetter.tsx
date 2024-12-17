import React, { useState, useEffect } from "react";
import styled from "styled-components";
import more from "../../../public/assets/more.svg";
import { Delete_letterbox } from "./Delete_letterbox";
import { Received_Modal } from "./Received_Modal";
import { EmptyLetter } from "./EmptyLetter";
import { Letter } from "./Letter";
import {
  getReceivedLetter,
  getLetterCounts,
} from "../../api/service/MemberService";
import { ReceiveLetterModel } from "../../api/model/MemberModel";

interface Props {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
  popup: boolean;
  setOpenLetter: React.Dispatch<React.SetStateAction<boolean>>;
  openLetter: boolean;
}

interface DeliverDayProps {
  deliverDate: string;
}

export const ReceivedLetter = ({
  setIsModalOpen,
  isModalOpen,
  setPopup,
  popup,
  setOpenLetter,
  openLetter,
}: Props) => {
  const [deleteAlert, setDeleteAlert] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState<string>("");
  const [selectId, setSelectId] = useState<number>(-1);
  const [letterCounts, setLetterCounts] = useState<number>(0);
  const [letters, setLetters] = useState<ReceiveLetterModel[]>([]);

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const letterdata = await getReceivedLetter();
        const counts = await getLetterCounts();
        setLetterCounts(counts.receiveLetterCount);
        setLetters(letterdata.data.letters);
        console.log(letterCounts);
        console.log(letterdata);
      } catch (err) {
        console.error("Error fetching letter counts:", err);
      }
    };

    fetchLetter();
  }, [letterCounts]);

  const openModal = (itemId: number) => {
    setSelectId(itemId);
    setIsModalOpen(true);
  };
  const handleLetter = (itemId: number) => {
    setSelectId(itemId);
    setOpenLetter(true);
  };

  const handleDelete = () => {
    setDeleteAlert("편지가 삭제되었어요");
    setTimeout(() => {
      setDeleteAlert(null);
    }, 5000); // 5초 후에 alert 를 숨기기
  };

  const DeliverDay: React.FC<DeliverDayProps> = ({ deliverDate }) => {
    const date = new Date(deliverDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[date.getDay()];

    return (
      <StyledDeliverDay>{`${year}. ${month}. ${day} (${weekday}) 전달`}</StyledDeliverDay>
    );
  };

  return (
    <>
      {letters.length === 0 ? (
        <EmptyLetter context="received" />
      ) : (
        <>
          {!openLetter && letters && (
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
              {letters.map((item) => (
                <LetterContainer
                  key={item.letterId}
                  $bgColor={item.coverTypeColor}
                >
                  <BookCover src={item.coverTypeImage} />
                  <Content
                    onClick={() => {
                      setDeleteTitle(item.title);
                      handleLetter(item.letterId);
                    }}
                  >
                    <BookName>{item.title}</BookName>
                    <DeliverDay deliverDate={item.deliveryDate}></DeliverDay>
                  </Content>
                  <MoreButton
                    src={more}
                    alt="more_btn"
                    onClick={() => {
                      setDeleteTitle(item.title);
                      openModal(item.letterId);
                    }}
                  />
                </LetterContainer>
              ))}
              {isModalOpen && (
                <Received_Modal
                  setIsModalOpen={setIsModalOpen}
                  setPopup={setPopup}
                  openLetter={openLetter}
                />
              )}
            </Container>
          )}
          {popup && !openLetter && (
            <Delete_letterbox
              setOpenLetter={setOpenLetter}
              setPopup={setPopup}
              onDelete={handleDelete}
              setIsModalOpen={setIsModalOpen}
              context="received"
              deleteItem={deleteTitle}
              letterId={selectId}
            />
          )}
          {openLetter && (
            <Letter
              setOpenLetter={setOpenLetter}
              context="received"
              isModalOpen={isModalOpen}
              setPopup={setPopup}
              popup={popup}
              onDelete={handleDelete}
              deleteItem={deleteTitle}
              setIsModalOpen={setIsModalOpen}
              letterId={selectId}
              openLetter={openLetter}
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
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
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
const LetterContainer = styled.div<{ $bgColor: string }>`
  display: flex;
  width: 100%;
  margin-bottom: 16px;
  box-sizing: border-box;
  padding: 20px 16px;
  align-items: flex-start;
  gap: 12px;
  border-radius: 12px;
  background-color: ${(props) => props.$bgColor};
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
const StyledDeliverDay = styled.div`
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
  cursor: pointer;
`;
