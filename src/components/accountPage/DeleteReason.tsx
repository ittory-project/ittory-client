import React, { useEffect, useState } from "react";
import styled from "styled-components";
import prev from "../../../public/assets/prev.png";

interface Props {
  setViewReason: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DeleteReason = ({ setViewReason }: Props) => {
  const handleReason = () => {
    setViewReason(false);
  };

  return (
    <BackGround>
      <Header>
        <Prev src={prev} onClick={handleReason} />
        <HeaderTxt>탈퇴하기</HeaderTxt>
      </Header>
      <Container>
        <TitleContainer>
          <Title>탈퇴하시려는 이유가 궁금해요</Title>
          <SubTitle>
            <Txt>그동안 저희 서비스를 이용해 주셔서 감사했습니다.</Txt>
            <Txt>소중한 의견을 들려주시면 더 나은 서비스를 만들기 위해</Txt>
            <Txt>최선을 다하겠습니다.</Txt>
          </SubTitle>
        </TitleContainer>
        <CheckList>
          <CheckContainer>자주 이용하지 않아요</CheckContainer>
          <CheckContainer>서비스 이용에 애로 사항이 있어요</CheckContainer>
          <CheckContainer>편지 작성이 불편해요</CheckContainer>
          <CheckContainer>서비스가 재미없어요</CheckContainer>
          <CheckContainer>기타</CheckContainer>
        </CheckList>
      </Container>
    </BackGround>
  );
};

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
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
const Container = styled.div`
  display: flex;
  padding: 0px 16px 20px 16px;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  box-sizing: border-box;
`;
const TitleContainer = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  align-self: stretch;
  margin-bottom: 28px;
`;
const Title = styled.div`
  align-self: stretch;
  color: #212529;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
const SubTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  align-self: stretch;
`;
const Txt = styled.div`
  align-self: stretch;
  color: #868e96;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
const CheckList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  align-self: stretch;
`;
const CheckContainer = styled.div`
  display: flex;
  padding: 16px;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  border-radius: 12px;
  background: #f8f9fa;
  color: #000;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.5px;
`;
