import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import deleteIcon from '@/assets/invite/delete.svg';

export const DeleteConfirm = () => {
  const navigate = useNavigate();

  const handleButton = () => {
    navigate('/', { replace: true });
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
  position: absolute;
  left: 50%;
  z-index: 30;

  box-sizing: border-box;
  display: flex;

  flex: 1 0 0;
  flex-direction: column;

  align-items: center;
  align-self: stretch;
  justify-content: space-between;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  padding: 120px 16px 20px 16px;

  background: #fff;

  transform: translateX(-50%);
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

  gap: 8px;
  align-items: center;
  align-self: stretch;

  font-family: var(--Typography-family-caption, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #000;

  text-align: center;
  letter-spacing: -0.5px;
`;

const Button = styled.button`
  box-sizing: border-box;
  display: flex;

  gap: 8px;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 48px;

  padding: 14px 20px;

  background: #ffa256;
  border-radius: 50px;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
`;
const ButtonTxt = styled.div`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #fff;

  letter-spacing: -0.5px;
`;
