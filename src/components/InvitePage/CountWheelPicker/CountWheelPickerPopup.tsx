import React from 'react';

import styled from 'styled-components';

interface Props {
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setViewCount: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CountWheelPickerPopup = ({ setPopup, setViewCount }: Props) => {
  const handleCancel = () => {
    setPopup(false);
  };
  const openCount = () => {
    setPopup(false);
    setViewCount(true);
  };

  return (
    <>
      <Modal>
        <Title>이어 쓸 횟수를 정하면</Title>
        <Title>편지 작성이 바로 시작돼요</Title>
        <Contents>참여자가 모두 들어왔는지 확인해 주세요</Contents>
        <ButtonContainer>
          <Button
            style={{
              background: '#CED4DA',
            }}
            onClick={handleCancel}
          >
            <ButtonTxt style={{ color: '#495057' }}>취소하기</ButtonTxt>
          </Button>
          <Button
            style={{
              background: '#FFA256',
            }}
            onClick={openCount}
          >
            <ButtonTxt style={{ color: '#fff' }}>횟수 정하기</ButtonTxt>
          </Button>
        </ButtonContainer>
      </Modal>
    </>
  );
};

const Modal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 30;

  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  align-items: center;

  width: 272px;
  height: 11rem;

  padding: 24px;

  background: linear-gradient(144deg, #fff -0.87%, #fff 109.18%);
  border: 3px solid #d3edff;
  border-radius: 16px;

  transform: translate(-50%, -50%);
`;

const Title = styled.div`
  display: flex;

  flex-direction: column;

  gap: var(--Border-Radius-radius_300, 8px);
  align-items: center;
  align-self: stretch;

  font-family: var(--Typography-family-caption, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #212529;

  text-align: center;
  letter-spacing: -0.5px;
`;
const Contents = styled.div`
  display: flex;

  flex-direction: column;

  gap: var(--Border-Radius-radius_300, 8px);
  align-items: center;
  align-self: stretch;

  margin-top: 8px;

  font-family: var(--Typography-family-caption, SUIT);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;

  line-height: 16px;

  color: #868e96;

  text-align: center;
  letter-spacing: -0.5px;
`;
const ButtonContainer = styled.div`
  position: relative;

  display: flex;
  display: flex;

  gap: 8px;
  align-items: flex-start;
  align-items: center;
  align-self: stretch;
  justify-content: center;

  width: 100%;

  margin-top: 1.35rem;
`;
const Button = styled.button`
  box-sizing: border-box;
  display: flex;

  flex: 1 0 0;

  gap: 8px;
  align-items: center;
  justify-content: center;

  height: 40px;

  padding: 14px 20px;

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
