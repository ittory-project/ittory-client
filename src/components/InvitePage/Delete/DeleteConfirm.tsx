import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import deleteIcon from "../../../../public/assets/invite/delete.svg";

export const DeleteConfirm = () => {
  const navigate = useNavigate();

  const handleButton = () => {
    navigate("/", { replace: true });
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
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  height: calc(var(--vh, 1vh) * 100);
  width: 100%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 120px 16px 20px 16px;
  justify-content: space-between;
  flex: 1 0 0;
  align-self: stretch;
  z-index: 30;
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
`;

const Button = styled.button`
  box-sizing: border-box;
  display: flex;
  height: 48px;
  width: 100%;
  padding: 14px 20px;
  align-items: center;
  gap: 8px;
  justify-content: center;
  border-radius: 50px;
  background: #ffa256;
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
  letter-spacing: -0.5px;
  color: #fff;
`;
