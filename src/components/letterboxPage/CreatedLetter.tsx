import React, { useState, useEffect } from "react";
import styled from "styled-components";
import more from "../../../public/assets/more.svg";
import { Created_Modal } from "./Created_Modal";
import { Delete_letterbox } from "./Delete_letterbox";
import { EmptyLetter } from "./EmptyLetter";
import { Letter } from "./Letter";
import {
  getParticipatedLetter,
  getLetterCounts,
} from "../../api/service/MemberService";
import { ParticipateLetterModel } from "../../api/model/MemberModel";
import { Loading } from "./Loading";

interface DeliverDayProps {
  deliverDate: string;
}

interface Props {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenLetter: React.Dispatch<React.SetStateAction<boolean>>;
  popup: boolean;
  openLetter: boolean;
  setDeleteAlert: React.Dispatch<React.SetStateAction<string | null>>;
  setDeletedAlert: React.Dispatch<React.SetStateAction<string | null>>;
  deleteAlert: string | null;
  deletedAlert: string | null;
}

export const CreatedLetter = ({
  setIsModalOpen,
  isModalOpen,
  setPopup,
  popup,
  setOpenLetter,
  openLetter,
  deleteAlert,
  setDeleteAlert,
  setDeletedAlert,
}: Props) => {
  const [deleteName, setDeleteName] = useState<string>("");
  const [selectId, setSelectId] = useState<number>(-1);
  const [letterCounts, setLetterCounts] = useState<number>(0);
  const [letters, setLetters] = useState<ParticipateLetterModel[]>([]);
  const [load, setLoad] = useState<boolean>(true);

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const letterdata = await getParticipatedLetter();
        const counts = await getLetterCounts();
        setLetterCounts(counts.participationLetterCount);
        setLetters(letterdata.data.letters);
        setLoad(false);
        console.log(letters);
      } catch (err) {
        console.error("Error fetching letter counts:", err);
      }
    };

    fetchLetter();
  }, []);

  useEffect(() => {
    const fetchLetter = async () => {
      console.log("setDeletedAlert 실행");
      try {
        const letterdata = await getParticipatedLetter();
        const counts = await getLetterCounts();
        setLetterCounts(counts.participationLetterCount);
        setLetters(letterdata.data.letters);
        setLoad(false);
        console.log(letters);
      } catch (err) {
        console.error("Error fetching letter counts:", err);
      }
    };

    fetchLetter();
  }, [setDeletedAlert]);

  const openModal = (itemId: number) => {
    setSelectId(itemId);
    setIsModalOpen(true);
  };

  const handleLetter = (itemId: number) => {
    setSelectId(itemId);
    setOpenLetter(true);
  };

  useEffect(() => {
    const fetchLetter = async () => {
      console.log("setDeleteAlert 실행");
      if (deleteAlert !== null) {
        try {
          const letterdata = await getParticipatedLetter();
          const counts = await getLetterCounts();
          setLetterCounts(counts.participationLetterCount);
          setLetters(letterdata.data.letters);

          console.log("새로운데이터 가져옴");

          const deletedMessage = localStorage.getItem("deletedLetter");
          setDeletedAlert(deletedMessage);
        } catch (err) {
          console.error("Error fetching letter counts:", err);
        }
      }
    };

    fetchLetter();
  }, [deleteAlert]);

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

  console.log(selectId);

  return (
    <>
      {load === true ? (
        <Loading />
      ) : letters.length !== 0 ? (
        <>
          {!openLetter && letters && (
            <Container>
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
                      setDeleteName(item.receiverName);
                      handleLetter(item.letterId);
                    }}
                  >
                    <BookName>To. {item.receiverName}</BookName>
                    <DeliverDay deliverDate={item.deliveryDate}></DeliverDay>
                  </Content>
                  <MoreButton
                    src={more}
                    alt="more_btn"
                    onClick={() => {
                      setDeleteName(item.receiverName);
                      openModal(item.letterId);
                    }}
                  />
                </LetterContainer>
              ))}
              {isModalOpen && (
                <Created_Modal
                  setIsModalOpen={setIsModalOpen}
                  setPopup={setPopup}
                  openLetter={openLetter}
                  letterId={selectId}
                />
              )}
            </Container>
          )}
          {popup && !openLetter && (
            <Delete_letterbox
              setOpenLetter={setOpenLetter}
              setPopup={setPopup}
              setIsModalOpen={setIsModalOpen}
              context="created"
              deleteItem={deleteName}
              letterId={selectId}
              setDeleteAlert={setDeleteAlert}
              deleteAlert={deleteAlert}
            />
          )}
          {openLetter && (
            <Letter
              setOpenLetter={setOpenLetter}
              context="created"
              isModalOpen={isModalOpen}
              setPopup={setPopup}
              popup={popup}
              deleteItem={deleteName}
              letterId={selectId}
              setIsModalOpen={setIsModalOpen}
              openLetter={openLetter}
              setDeleteAlert={setDeleteAlert}
              deleteAlert={deleteAlert}
            />
          )}
        </>
      ) : (
        // letters 배열이 비어 있으면 EmptyLetter 컴포넌트 출력
        <EmptyLetter context="created" />
      )}
    </>
  );
};

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
  cursor: pointer;
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
