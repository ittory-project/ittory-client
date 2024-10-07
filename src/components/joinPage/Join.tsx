import React, { useState } from "react";
import styled from "styled-components";
import { JoinModal } from "./JoinModal";

export const Join = () => {
  const [nickname, setNickname] = useState<string>("");
  const [viewModal, setViewModal] = useState<boolean>(false);

  const handleModal = () => {
    setViewModal(true);
  };

  return (
    <BackGround>
      {!viewModal && (
        <>
          <Title>
            <Text>닝닝님, 환영해요!</Text>
            {/* 카카오계정 이름으로 */}
            <Text>편지에 사용할 닉네임을 정해주세요</Text>
          </Title>
          <Container>
            <InputBox>
              <InputLogo>내 이름</InputLogo>
              <Input
                required
                placeholder="5자까지 입력할 수 있어요"
                type="text"
                value={nickname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.value.length > 5) {
                    e.target.value = e.target.value.slice(0, 5);
                  }
                  setNickname(e.target.value);
                }}
                minlength="1"
                maxlength="5"
                spellcheck="false"
              />
            </InputBox>
          </Container>
          {nickname === "" ? (
            <Button disabled={true} style={{ background: "#ced4da" }}>
              <ButtonTxt>완료</ButtonTxt>
            </Button>
          ) : (
            <Button
              style={{
                background: "#FFA256",
                boxShadow:
                  "1px -1px 0.4px 0px rgba(0, 0, 0, 0.14), 1px 1px 0.4px 0px rgba(255, 255, 255, 0.30)",
              }}
              onClick={handleModal}
            >
              <ButtonTxt>완료</ButtonTxt>
            </Button>
          )}
        </>
      )}
      {viewModal && (
        <JoinModal nickname={nickname} setViewModal={setViewModal} />
      )}
    </BackGround>
  );
};

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(
    180deg,
    #d3edff 0%,
    #e7f6f7 46.2%,
    #feffee 97.27%
  );
  background-blend-mode: overlay, normal;
  overflow: hidden;
`;
const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
`;
const Text = styled.span`
  display: block;
  color: #243348;
  text-align: center;
  font-family: var(--Typography-family-title, SUIT);
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
const Container = styled.div`
  display: flex;
  padding: 20px;
  width: 288px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0px 0px 6px 0px rgba(36, 51, 72, 0.08);
`;
const InputBox = styled.div`
  display: flex;
  width: 16rem;
  flex-direction: column;
  justify-content: center;
  height: 3.5rem;
  gap: 6px;
  margin-top: 0;
  border-bottom: 1px dashed #dee2e6;
  margin-bottom: 1.8px;
`;
const InputLogo = styled.div`
  color: #495057;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: 11px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
const Input = styled.input`
  width: 232px;
  height: 24px;
  border: 0;
  padding-left: 0;
  &::placeholder {
    color: #adb5bd;
    font-family: var(--Typography-family-title, SUIT);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -0.5px;
  }
  &:valid {
    color: #212529;
    font-family: var(--Typography-family-title, SUIT);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -0.5px;
  }
  &:focus {
    outline: none;
  }
`;
const Button = styled.button`
  width: 288px;
  cursor: pointer;
  display: flex;
  height: 48px;
  padding: 14px 20px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  align-self: stretch;
  border-radius: 50px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
`;
const ButtonTxt = styled.div`
  color: #fff;
  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
