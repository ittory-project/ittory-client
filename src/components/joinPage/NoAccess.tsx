import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import joinblock from '../../../public/assets/join/joinblock.svg';

export default function NoAccess() {
  const navigate = useNavigate();

  const handleButton = () => {
    navigate('/');
  };
  return (
    <BackGround>
      <Container>
        <Icon src={joinblock} />
        <Title>정원 초과로 입장할 수 없어요</Title>
        <SubTitle>하나의 편지에는 최대 5명까지 입장할 수 있어요</SubTitle>
      </Container>

      <Button onClick={handleButton}>
        <ButtonTxt>홈으로</ButtonTxt>
      </Button>
    </BackGround>
  );
}

const BackGround = styled.div`
  position: relative;
  left: 50%;

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

  margin-bottom: 8px;

  font-family: var(--Typography-family-caption, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #000;

  text-align: center;
  letter-spacing: -0.5px;
`;
const SubTitle = styled.div`
  display: flex;

  flex-direction: column;

  gap: 8px;
  align-items: center;
  align-self: stretch;

  font-family: var(--Typography-family-caption, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;

  line-height: 20px;

  color: #090a0b;

  text-align: center;
  letter-spacing: -0.5px;
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

const Button = styled.button`
  position: absolute;
  bottom: 20px;
  left: 50%;

  display: flex;

  gap: 8px;
  align-items: center;
  align-self: stretch;
  justify-content: center;

  width: 288px;
  height: 48px;

  padding: 14px 20px;

  cursor: pointer;

  background: #ffa256;
  border-radius: 50px;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;

  transform: translateX(-50%);
`;
