import React, { useState } from "react";
import styled from "styled-components";
import X from "../../../public/assets/X.png";
import delete2 from "../../../public/assets/delete2.svg";
import share from "../../../public/assets/share.svg";

interface Props {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Created_Modal = ({ setIsModalOpen, setPopup }: Props) => {
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePopup = () => {
    setPopup(true);
  };

  const handleShare = async () => {
    const url = "https://shinsangeun.github.io";
    if (navigator.share) {
      try {
        await navigator.share({
          title: "기록하며 성장하기",
          text: "Hello World",
          url,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url); // 링크를 클립보드에 복사
        console.log("URL copied to clipboard!");
      } catch (error) {
        console.error("Copy failed:", error);
      }
    }
  };

  return (
    <ModalContainer>
      <Header>
        <Cancel src={X} alt="cancel" onClick={closeModal} />
      </Header>
      <Contents>
        <List onClick={handleShare}>
          <ShareIcon src={share} alt="share" />
          <Txt>공유하기</Txt>
        </List>
        <List onClick={handlePopup}>
          <DeleteIcon src={delete2} alt="delete" />
          <Txt>삭제하기</Txt>
        </List>
      </Contents>
    </ModalContainer>
  );
};

const ModalContainer = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  border-radius: 20px 20px 0px 0px;
  background: #fff;
  z-index: 100;
  flex-direction: column;
  align-items: center;
`;
const Header = styled.div`
  display: flex;
  height: 44px;
  padding: 16px 12px 0 16px;
  flex-direction: column;
  align-items: flex-end;
  align-self: stretch;
  box-sizing: border-box;
`;
const Cancel = styled.img`
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  margin-right: 7.3px;
`;
const Contents = styled.div`
  display: flex;
  padding: 0px 16px 24px 16px;
  flex-direction: column;
  align-items: flex-end;
  align-self: stretch;
`;
const List = styled.div`
  display: flex;
  padding: 12px 0px;
  align-items: center;
  gap: 8px;
  align-self: stretch;
`;
const ShareIcon = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-left: 4px;
  margin-right: 4px;
`;
const DeleteIcon = styled.img`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`;
const Txt = styled.div`
  color: #212529;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
