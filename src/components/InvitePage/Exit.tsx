import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface Props {
  setViewExit: React.Dispatch<React.SetStateAction<boolean>>;
}
//방장에게만 적용되는 팝업
export const Exit = ({ setViewExit }: Props) => {
  const handleExit = () => {
    setViewExit(false);
  };

  return (
    <BackGround>
      <Modal>
        <Title>정말 나가시겠어요?</Title>
        <Contents>지금 나가게 되면 다른 참여자가 방장이 될 거예요</Contents>
        <ButtonContainer>
          <Button
            style={{
              background: "#CED4DA",
            }}
          >
            <ButtonTxt style={{ color: "#495057" }} onClick={handleExit}>
              취소하기
            </ButtonTxt>
          </Button>
          <Button
            style={{
              background: "#FFA256",
            }}
          >
            <ButtonTxt style={{ color: "#fff" }}>나가기</ButtonTxt>
          </Button>
          {/* 랜딩페이지로 이동 */}
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
  background: rgba(0, 0, 0, 0.7);
`;
const Modal = styled.div`
  display: flex;
  width: 272px;
  height: 10rem;
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
  margin-bottom: 8px;
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
`;
const ButtonContainer = styled.div`
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  position: relative;
  //bottom: 20px;
  margin-top: 1.35rem;
  justify-content: center; /* 버튼들을 중앙에 배치 */
  display: flex;
  width: 224px;
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
  //position: relative;
`;
const ButtonTxt = styled.div`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: -0.5px;
`;
