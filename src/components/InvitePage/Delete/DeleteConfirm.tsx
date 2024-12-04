import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import deleteIcon from "../../../../public/assets/invite/delete.svg";

export const DeleteConfirm = () => {
  const navigate = useNavigate();

  const handleButton = () => {
    navigate("/");
  };
  return (
    <BackGround>
      <Container>
        <Icon src={deleteIcon} />
        <Title>방장이 편지를 삭제하여</Title>
        <Title>종료되었어요</Title>
      </Container>

      <Button onClick={handleButton}>
        <ButtonTxt>홈으로</ButtonTxt>
      </Button>
    </BackGround>
  );
};

const BackGround = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  //justify-content: center;
  height: 100vh;
  width: 100%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 120px 16px 20px 16px;
  justify-content: space-between;
  flex: 1 0 0;
  align-self: stretch;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
`;
const Icon = styled.img`
  width: 140px;
  height: 140px;
  margin-bottom: 16px;
`;
const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  color: #000;
  text-align: center;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
`;

const Button = styled.button`
  box-sizing: border-box;
  display: flex;
  height: 48px;
  padding: var(--Typography-size-s, 14px) 0px;
  align-items: center;
  gap: 8px;
  justify-content: center;
  border-radius: 50px;
  background: #ffa256;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
  width: 100%;
`;
const ButtonTxt = styled.div`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
  color: #fff;
`;
