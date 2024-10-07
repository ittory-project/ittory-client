import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

interface Props {
  context: string;
}

export const EmptyLetter = ({ context }: Props) => {
  const navigate = useNavigate();

  const navigateToCreate = () => {
    navigate("/Create");
  };

  return (
    <Container>
      <ImgArea />
      {context === "created" && (
        <>
          <TextArea>참여한 편지가 없네요</TextArea>
          <TextArea>편지를 만들어서 마음을 전달해 보아요!</TextArea>
        </>
      )}
      {context === "received" && (
        <>
          <TextArea>받은 편지가 없네요</TextArea>
          <TextArea>먼저 마음을 전달해 보는 건 어떨까요?</TextArea>
        </>
      )}

      <Button onClick={navigateToCreate}>
        <ButtonTxt>편지 쓰러가기</ButtonTxt>
      </Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 100px 36px 0px 36px;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
`;
const ImgArea = styled.div`
  display: flex;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  background: #d9d9d9;
  margin-bottom: 20px;
`;
const TextArea = styled.div`
  display: flex;
  color: #495057;
  text-align: center;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.5px;
`;
const Button = styled.button`
  box-sizing: border-box;
  margin-top: 20px;
  display: flex;
  width: 138px;
  height: 42px;
  padding: 14px 20px;
  align-items: center;
  gap: 8px;
  flex: 1 0 0;
  background: #343a40;
  justify-content: center;
  border-radius: 50px;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
`;
const ButtonTxt = styled.div`
  font-family: SUIT;
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: -0.5px;
`;
