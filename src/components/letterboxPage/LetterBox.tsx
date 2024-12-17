import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { CreatedLetter } from "./CreatedLetter";
import { ReceivedLetter } from "./ReceivedLetter";
import prev from "../../../public/assets/prev.svg";
import { useParams } from "react-router-dom";

export const LetterBox = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { letterId } = useParams();

  const [focusOn, setFocusOn] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);
  const [openLetter, setOpenLetter] = useState<boolean>(false);
  const [create, setCreate] = useState<boolean>(false);
  const [receive, setReceive] = useState<boolean>(false);
  const [deleteAlert, setDeleteAlert] = useState<string | null>(null);
  const [deletedAlert, setDeletedAlert] = useState<string | null>(null);

  useEffect(() => {
    if (Number(letterId) > 0) {
      setOpenLetter(true);
    } else {
      setOpenLetter(false);
    }
  }, [letterId, setOpenLetter]);

  useEffect(() => {
    const focusCreate = location.state?.focusCreate;
    const focusReceive = location.state?.focusReceive;

    console.log(focusCreate, focusReceive);

    if (focusCreate) {
      setCreate(focusCreate);
    } else if (focusReceive) {
      setReceive(focusReceive);
    } else {
      setCreate(true);
      setReceive(false);
    }
  }, []);

  useEffect(() => {
    if (focusOn === "create") {
      setCreate(true);
      setReceive(false);
    } else if (focusOn === "receive") {
      setCreate(false);
      setReceive(true);
    }
  }, [focusOn]);

  const handleFocusCreate = () => {
    setFocusOn("create");
  };

  const handleFocusReceive = () => {
    setFocusOn("receive");
  };

  const navigateBack = () => {
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (deletedAlert) {
      console.log(deletedAlert);
      // deletedAlert 값이 있을 때만 타이머 설정
      const timer = setTimeout(() => {
        setDeletedAlert(null); // 3초 후 알림 숨기기
        localStorage.removeItem("deletedLetter");
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      const deletedMessage = localStorage.getItem("deletedLetter");
      console.log("삭제된 메시지:", deletedMessage);
      setDeletedAlert(deletedMessage);
    }
  }, [deletedAlert]);

  return (
    <BackGround>
      {(isModalOpen || popup) && <Overlay />}
      {!openLetter && (
        <>
          {deletedAlert && <DeleteAlert>{deletedAlert}</DeleteAlert>}
          <Header>
            <Prev src={prev} onClick={navigateBack} />
            <HeaderTxt>편지함</HeaderTxt>
          </Header>
          <TitleContainer>
            <CreatedLetterBox $focus={create} onClick={handleFocusCreate}>
              참여한 편지
            </CreatedLetterBox>
            <ReceivedLetterBox $focus={receive} onClick={handleFocusReceive}>
              받은 편지
            </ReceivedLetterBox>
          </TitleContainer>
        </>
      )}
      {create && (
        <CreatedLetter
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          setPopup={setPopup}
          popup={popup}
          setOpenLetter={setOpenLetter}
          openLetter={openLetter}
          deleteAlert={deleteAlert}
          setDeleteAlert={setDeleteAlert}
          deletedAlert={deletedAlert}
          setDeletedAlert={setDeletedAlert}
        />
      )}
      {receive && (
        <ReceivedLetter
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          setPopup={setPopup}
          popup={popup}
          setOpenLetter={setOpenLetter}
          openLetter={openLetter}
          deleteAlert={deleteAlert}
          setDeleteAlert={setDeleteAlert}
          deletedAlert={deletedAlert}
          setDeletedAlert={setDeletedAlert}
        />
      )}
    </BackGround>
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

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(var(--vh, 1vh) * 100);
  width: 100%;
  position: relative;
  background: #fff;
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  transition: background 0.3s ease;
  z-index: 99;
`;
const Header = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 0px var(--Border-Radius-radius_100, 4px);
  justify-content: space-between;
  align-items: center;
`;
const Prev = styled.img`
  width: 8px;
  height: 16px;
  margin-left: 16px;
  margin-right: 12px;
  flex-shrink: 0;
  cursor: pointer;
`;
const HeaderTxt = styled.div`
  display: flex;
  height: 24px;
  padding: 12px;
  align-items: center;
  gap: 16px;
  flex: 1 0 0;
  color: #212529;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: stretch;
  width: 100%;
`;
const CreatedLetterBox = styled.div<{ $focus: boolean }>`
  display: flex;
    cursor: pointer;
  box-sizing: border-box;
  padding: 12px 0px;
  flex-direction: column;
  align-items: center;
  flex: 1 0 0;
  align-self: stretch;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing:;-0.5px;
  color: ${(props) => (props.$focus ? "#212529" : "#ADB5BD")};
  border-bottom:${(props) => (props.$focus ? "1px solid #212529" : "1px solid #dee2e6")};
`;
const ReceivedLetterBox = styled.div<{ $focus: boolean }>`
  display: flex;
    cursor: pointer;
  box-sizing: border-box;
  padding: 12px 0px;
  flex-direction: column;
  align-items: center;
  flex: 1 0 0;
  align-self: stretch;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing:;-0.5px;
  color: ${(props) => (props.$focus ? "#212529" : "#ADB5BD")};
    border-bottom:${(props) => (props.$focus ? "1px solid #212529" : "1px solid #dee2e6")};
`;
