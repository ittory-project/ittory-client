import React, { useState } from "react";
import styled from "styled-components";

interface Props {
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setViewCount: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CountPopup = ({ setPopup, setViewCount }: Props) => {
  const handleCancel = () => {
    setPopup(false);
  };
  const openCount = () => {
    setPopup(false);
    setViewCount(true);
  };

  return (
    <BackGround>
      <Modal>
        <Title>이어 쓸 횟수를 정하면</Title>
        <Title>편지 작성이 바로 시작돼요</Title>
        <Contents>참여자가 모두 들어왔는지 확인해 주세요</Contents>
        <ButtonContainer>
          <Button
            style={{
              background: "#CED4DA",
            }}
            onClick={handleCancel}
          >
            <ButtonTxt style={{ color: "#495057" }}>취소하기</ButtonTxt>
          </Button>
          <Button
            style={{
              background: "#FFA256",
            }}
            onClick={openCount}
          >
            <ButtonTxt style={{ color: "#fff" }}>횟수 정하기</ButtonTxt>
          </Button>
        </ButtonContainer>
      </Modal>
    </BackGround>
  );
};

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  //justify-content: center;
  height: 100vh;
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
`;
const Modal = styled.div`
  display: flex;
  width: 272px;
  height: 11.6rem;
  box-sizing: border-box;
  padding: 24px;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 16px;
  border: 3px solid #d3edff;
  background: linear-gradient(144deg, #fff -0.87%, #fff 109.18%);
  z-index: 100;
  align-items: center;
  margin: 0;
`;
const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--Border-Radius-radius_300, 8px);
  align-self: stretch;
  color: #212529;
  text-align: center;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
const Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--Border-Radius-radius_300, 8px);
  align-self: stretch;
  color: #868e96;
  text-align: center;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: -0.5px;
  margin-top: 8px;
`;
const ButtonContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  position: relative;
  margin-top: 1.35rem;
  justify-content: center;
  display: flex;
  width: 100%;
  align-items: center;
`;
const Button = styled.button`
  box-sizing: border-box;
  display: flex;
  height: 40px;
  padding: 14px 20px;
  align-items: center;
  gap: 8px;
  flex: 1 0 0;
  justify-content: center;
  border-radius: 50px;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
`;
const ButtonTxt = styled.span`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: -0.5px;
`;
