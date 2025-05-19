import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import exitImg from '../../../public/assets/write/img_exit.svg';

interface ErrorFullScreenProps {
  errorMessage?: string | null;
  onReset?: () => void;
}

export const ErrorFullScreen = ({
  errorMessage: reasonText = '죄송합니다\n알 수 없는 오류가 발생했습니다',
  onReset,
}: ErrorFullScreenProps) => {
  const navigate = useNavigate();

  const handleButton = () => {
    onReset?.();
    navigate('/', { replace: true });
  };

  return (
    <BackGround>
      <Container>
        <Icon src={exitImg} />
        <Title>{reasonText}</Title>
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

  flex-direction: column;

  align-items: center;
  align-self: stretch;
  justify-content: space-between;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  background: #fff;

  transform: translateX(-50%);
`;
const Container = styled.div`
  display: flex;

  flex-direction: column;

  align-items: center;

  margin: auto;
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
  white-space: pre-wrap;
`;

const Button = styled.button`
  box-sizing: border-box;
  display: flex;

  gap: 8px;
  align-items: center;
  justify-content: center;

  width: 90%;
  height: 48px;

  margin: 14px 20px;

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
