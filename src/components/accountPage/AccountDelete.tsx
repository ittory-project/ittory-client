import React, { useEffect, useState } from "react";
import styled from "styled-components";
import prev from "../../../public/assets/prev.png";
import bell from "../../../public/assets/bell.svg";
import check from "../../../public/assets/check.svg";
import { DeleteReason } from "./DeleteReason";

interface Props {
  setViewDelete: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AccountDelete = ({ setViewDelete }: Props) => {
  const [viewReason, setViewReason] = useState<boolean>(false);

  const handleDelete = () => {
    setViewDelete(false);
  };

  const handleReason = () => {
    setViewReason(true);
  };

  return (
    <BackGround>
      {viewReason === false && (
        <>
          <Header>
            <Prev src={prev} onClick={handleDelete} />
            <HeaderTxt>탈퇴하기</HeaderTxt>
          </Header>
          <Container>
            <Bell src={bell} />
            <Title>카리나님,</Title>
            <Title>탈퇴하기시 전에 확인해 주세요</Title>
            <Contents>
              <TxtList>
                <Check>
                  <img src={check} style={{ width: "16px", height: "16px" }} />
                </Check>
                탈퇴 시 해당 계정은 즉시 삭제되며, 복구할 수 없습니다.
              </TxtList>
              <TxtList>
                <Check>
                  <img src={check} style={{ width: "16px", height: "16px" }} />
                </Check>
                참여한 편지는 내 편지함에서 삭제되지만, 다른 참여자의
                편지함에서는 내 기록이 유지됩니다.
              </TxtList>
              <TxtList>
                <Check>
                  <img src={check} style={{ width: "16px", height: "16px" }} />
                </Check>
                받은 편지는 내 편지함에서 삭제되며, 누구도 다시 보관할 수
                없습니다.
              </TxtList>
              <TxtList>
                <Check>
                  <img src={check} style={{ width: "16px", height: "16px" }} />
                </Check>
                탈퇴 후에도 동일한 이메일로 재가입할 수 있습니다.
              </TxtList>
            </Contents>
          </Container>
          <ButtonContainer>
            <Button
              style={{
                background: "#CED4DA",
              }}
              onClick={handleDelete}
            >
              <ButtonTxt style={{ color: "#495057" }}>더 써볼게요</ButtonTxt>
            </Button>
            <Button
              style={{
                background: "#FFA256",
              }}
              onClick={handleReason}
            >
              <ButtonTxt style={{ color: "#fff" }}>확인했어요!</ButtonTxt>
            </Button>
            {/* 클릭 시 랜딩페이지로 이동 */}
          </ButtonContainer>
        </>
      )}
      {viewReason && <DeleteReason setViewReason={setViewReason} />}
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
  flex: 1 0 0;
  align-self: stretch;
  box-sizing: border-box;
  margin-top: 0.75rem;
`;
const Bell = styled.img`
  width: 32px;
  height: 36px;
  flex-shrink: 0;
  margin-top: 6px;
  margin-bottom: 14px;
`;
const Title = styled.div`
  align-self: stretch;
  text-align: center;
  color: #000;
  font-family: SUIT;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
const Contents = styled.div`
  display: flex;
  box-sizing: border-box;
  margin-top: 24px;
  padding: 20px 0px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  align-self: stretch;
`;
const TxtList = styled.div`
  display: flex;
  padding: 0px 16px;
  align-items: flex-start;
  gap: 12px;
  align-self: stretch;
  color: #495057;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
const Check = styled.div`
  display: flex;
  padding-top: 2px;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;
const ButtonContainer = styled.div`
  align-items: flex-start;
  gap: 8px;
  padding: 0px 16px 20px 16px;
  align-self: stretch;
  position: relative;
  justify-content: center;
  display: flex;
  align-items: center;
`;
const Button = styled.button`
  box-sizing: border-box;
  display: flex;
  width: 140px;
  height: 48px;
  padding: 14px 20px;
  align-items: center;
  gap: 8px;
  flex: 1 0 0;
  justify-content: center;
  border-radius: 50px;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
`;
const ButtonTxt = styled.div`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: -0.5px;
`;
