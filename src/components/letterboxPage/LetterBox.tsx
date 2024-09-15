import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { CreatedLetter } from "./CreatedLetter";
import { ReceivedLetter } from "./ReceivedLetter";
import prev from "../../../public/assets/prev.png";

export const LetterBox = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const focusCreate = location.state.focusCreate;
  const focusReceive = location.state.focusReceive;

  const [focusOn, setFocusOn] = useState<string | null>(null);
  const [create, setCreate] = useState<boolean>(focusCreate);
  const [receive, setReceive] = useState<boolean>(focusReceive);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);
  const [openLetter, setOpenLetter] = useState<boolean>(false);

  const navigateBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    setCreate(focusCreate);
    setReceive(focusReceive);
  }, [focusCreate, focusReceive]);

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

  return (
    <BackGround>
      {isModalOpen && !openLetter && <Overlay />}
      {!popup && !openLetter && (
        <>
          <Header>
            <Prev src={prev} onClick={navigateBack} />
            <HeaderTxt>편지함</HeaderTxt>
          </Header>
          <TitleContainer>
            <CreatedLetterBox focus={create} onClick={handleFocusCreate}>
              참여한 편지
            </CreatedLetterBox>
            <ReceivedLetterBox focus={receive} onClick={handleFocusReceive}>
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
        />
      )}
    </BackGround>
  );
};

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  position: relative;
  background: #fff;
  overflow: hidden;
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
const CreatedLetterBox = styled.div<{ focus: boolean }>`
  display: flex;
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
  color: ${(props) => (props.focus ? "#212529" : "#ADB5BD")};
  border-bottom:${(props) => (props.focus ? "1px solid #212529" : "1px solid #dee2e6")};
`;
const ReceivedLetterBox = styled.div<{ focus: boolean }>`
  display: flex;
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
  color: ${(props) => (props.focus ? "#212529" : "#ADB5BD")};
    border-bottom:${(props) => (props.focus ? "1px solid #212529" : "1px solid #dee2e6")};
`;
