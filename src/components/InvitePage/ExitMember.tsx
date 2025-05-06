import React from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { getWebSocketApi } from '../../api/experimental/instance';

interface Props {
  setViewExit: React.Dispatch<React.SetStateAction<boolean>>;
  letterId: number;
}
//방장에게만 적용되는 팝업
export const Exit = ({ setViewExit, letterId }: Props) => {
  const wsApi = getWebSocketApi();
  const navigate = useNavigate();
  const handleExitCancel = () => {
    setViewExit(false);
  };

  const handleExit = () => {
    wsApi.send('quitLetter', [letterId]);
    navigate('/', { replace: true });
  };

  return (
    <>
      <Modal>
        <Title>정말 나가시겠어요?</Title>
        <Contents>편지가 시작되기 전까진 다시 참여할 수 있어요</Contents>
        <ButtonContainer>
          <Button
            style={{
              background: '#CED4DA',
            }}
            onClick={handleExitCancel}
          >
            <ButtonTxt style={{ color: '#495057' }}>취소하기</ButtonTxt>
          </Button>
          <Button
            style={{
              background: '#FFA256',
            }}
            onClick={handleExit}
          >
            <ButtonTxt style={{ color: '#fff' }}>나가기</ButtonTxt>
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
  z-index: 100;

  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  align-items: center;

  width: 272px;
  height: 10rem;

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

  margin-bottom: 8px;

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

  gap: 8px;
  align-items: flex-start;
  align-items: center;
  align-self: stretch;
  justify-content: center; /* 버튼들을 중앙에 배치 */

  width: 224px;

  margin-top: 1.35rem;
  //bottom: 20px;
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
