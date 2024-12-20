import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import joinblock from "../../../public/assets/join/joinblock.svg";

export default function NoAccess() {
  const navigate = useNavigate();

  const handleButton = () => {
    navigate("/");
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
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  //justify-content: center;
  height: calc(var(--vh, 1vh) * 100);
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
  margin-bottom: 8px;
`;
const SubTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  color: #090a0b;
  text-align: center;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.5px;
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
  background: #ffa256;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
`;
