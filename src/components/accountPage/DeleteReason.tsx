import React, { useEffect, useState } from "react";
import styled from "styled-components";
import prev from "../../../public/assets/prev.svg";
import check from "../../../public/assets/checkbox_gray.svg";
import checked from "../../../public/assets/checkbox_black.svg";
import { postWithdraw } from "../../api/service/MemberService";
import { WithdrawPostRequest } from "../../api/model/MemberModel";
import { WithdrawPopup } from "./WithdrawPopup";

interface Props {
  setViewReason: React.Dispatch<React.SetStateAction<boolean>>;
}

interface InputAreaProps {
  $otherReason: string;
}

export const DeleteReason = ({ setViewReason }: Props) => {
  const [selectedReason, setSelectedReason] = useState<number | null>(null);
  const [otherReason, setOtherReason] = useState<string>("");
  const [buttonEnable, setButtonEnable] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);
  const [length, setLength] = useState<number>(0);
  const [checked, setChecked] = useState<boolean>(false);

  const withdrawReason: string[] = [
    "NOT_USE",
    "ERROR",
    "INCONVENIENCE",
    "NOT_FUN",
    "ETC",
  ];

  const handleCheckboxChange = (reason: number) => {
    setChecked(!checked);
    setSelectedReason(reason);
  };

  useEffect(() => {
    if (selectedReason !== 4 && selectedReason !== null) {
      setOtherReason("");
      setLength(0);
      setButtonEnable(true);
    } else {
      setButtonEnable(false);
    }
  }, [selectedReason]);

  useEffect(() => {
    if (selectedReason === 4) {
      if (otherReason === "") {
        setButtonEnable(false);
      } else {
        setButtonEnable(true);
      }
    }
  }, [otherReason]);

  const handleReason = () => {
    setViewReason(false);
  };

  const handleOtherReasonChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setOtherReason(value);
      setLength(value.length);
    }
  };

  const handleWithdraw = async () => {
    if (selectedReason !== null) {
      const data: WithdrawPostRequest = {
        withdrawReason: withdrawReason[selectedReason],
        content: otherReason,
      };

      try {
        const response = await postWithdraw(data);
        localStorage.removeItem("jwt");
        console.log("Withdrawal successful:", response);
        setPopup(true);
      } catch (error) {
        console.error("Error in withdrawal:", error);
      }
    }
  };

  return (
    <>
      {popup && <Overlay />}
      <BackGround>
        <Header>
          <Prev src={prev} onClick={handleReason} />
          <HeaderTxt>탈퇴하기</HeaderTxt>
        </Header>
        <Container>
          <TitleContainer>
            <Title>탈퇴하시려는 이유가 궁금해요</Title>
            <SubTitle>
              <Txt>그동안 저희 서비스를 이용해 주셔서 감사했습니다.</Txt>
              <Txt>소중한 의견을 들려주시면 더 나은 서비스를 만들기 위해</Txt>
              <Txt>최선을 다하겠습니다.</Txt>
            </SubTitle>
          </TitleContainer>
          <CheckList>
            <CheckContainer onClick={() => handleCheckboxChange(0)}>
              <CheckBox
                type="checkbox"
                onChange={() => handleCheckboxChange(0)}
                checked={selectedReason === 0}
              />
              자주 이용하지 않아요
            </CheckContainer>
            <CheckContainer onClick={() => handleCheckboxChange(1)}>
              <CheckBox
                type="checkbox"
                onChange={() => handleCheckboxChange(1)}
                checked={selectedReason === 1}
              />
              서비스 이용에 애로 사항이 있어요
            </CheckContainer>
            <CheckContainer onClick={() => handleCheckboxChange(2)}>
              <CheckBox
                type="checkbox"
                onChange={() => handleCheckboxChange(2)}
                checked={selectedReason === 2}
              />
              편지 작성이 불편해요
            </CheckContainer>
            <CheckContainer onClick={() => handleCheckboxChange(3)}>
              <CheckBox
                type="checkbox"
                onChange={() => handleCheckboxChange(3)}
                checked={selectedReason === 3}
              />
              서비스가 재미없어요
            </CheckContainer>
            <CheckContainer onClick={() => handleCheckboxChange(4)}>
              <CheckBox
                type="checkbox"
                onChange={() => handleCheckboxChange(4)}
                checked={selectedReason === 4}
              />
              기타
            </CheckContainer>
            {selectedReason === 4 && (
              <InputArea $otherReason={otherReason}>
                <Input
                  placeholder="내용을 입력해 주세요"
                  value={otherReason}
                  onChange={handleOtherReasonChange}
                  spellCheck="false"
                  maxLength={100}
                />
                {length > 0 && (
                  <Count>
                    <CntTxt
                      style={{ color: length >= 100 ? "#FF0004" : "#495057" }}
                    >
                      {length}
                    </CntTxt>
                    <CntTxt style={{ color: "#868E96" }}>/100자</CntTxt>
                  </Count>
                )}
              </InputArea>
            )}
          </CheckList>
        </Container>
        <ButtonContainer>
          {buttonEnable ? (
            <Button
              style={{ background: "#FFA256", bottom: "16px" }}
              $selectedReason={selectedReason ?? 0}
              onClick={handleWithdraw}
            >
              <ButtonTxt>탈퇴할게요</ButtonTxt>
            </Button>
          ) : (
            <Button
              disabled={true}
              style={{ background: "#CED4DA" }}
              $selectedReason={selectedReason ?? 0}
              onClick={handleWithdraw}
            >
              <ButtonTxt>탈퇴할게요</ButtonTxt>
            </Button>
          )}
        </ButtonContainer>
      </BackGround>
      {popup && <WithdrawPopup />}
    </>
  );
};
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  transition: background 0.3s ease;
  z-index: 80;
`;
const BackGround = styled.div`
  display: flex;
  //position: fixed;
  flex-direction: column;
  height: calc(var(--vh, 1vh) * 100);
  width: 101%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  overflow-y: scroll;

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
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
  align-self: stretch;
  box-sizing: border-box;
  overflow-y: scroll;

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
`;
const TitleContainer = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  align-self: stretch;
  margin-bottom: 28px;
`;
const Title = styled.div`
  align-self: stretch;
  color: #212529;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
const SubTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  align-self: stretch;
`;
const Txt = styled.div`
  align-self: stretch;
  color: #868e96;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
const CheckList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  align-self: stretch;
`;
const CheckContainer = styled.div`
  display: flex;
  height: 52px;
  box-sizing: border-box;
  padding: 16px;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-radius: 12px;
  background: #f8f9fa;
  color: #000;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.5px;
  cursor: pointer;
`;
/*
const CheckBox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  background-image: url(${check});
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
  &:checked {
    background-image: url(${checked});
  }
`;*/
const CheckBox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  cursor: pointer;
  background: none;

  &:checked {
    background: none;
  }

  &::before {
    content: url(${check});
    width: 100%;
    height: 100%;
  }

  &:checked::before {
    content: url(${checked});
  }
`;

const InputArea = styled.div<InputAreaProps>`
  position: relative;
  width: 98%;
  border-radius: 12px;
  height: 140px;
  border: 1px solid
    ${({ $otherReason }) =>
      $otherReason && $otherReason.length > 0 ? "#212529" : "#adb5bd"};
  margin-bottom: 80px;
`;

const Input = styled.textarea`
  position: relative;
  padding: 16px 16px 0px 16px;
  width: 100%;
  height: 108px;
  box-sizing: border-box;
  border-radius: 12px;
  font-family: SUIT;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.5px;
  font-weight: 400;
  align-items: flex-start;
  border: none;
  gap: 2px;
  flex: 1 0 0;
  overflow: auto;
  resize: none;
  background-color: #fff;
  &::-webkit-scrollbar {
    display: none;
  }
  &::placeholder {
    color: #adb5bd;
  }
  &:valid {
    color: #000;
  }
  &:focus {
    outline: none;
    border: none;
  }
`;
const Count = styled.span`
  z-index: 1;
  position: absolute;
  left: 16px;
  top: 104px;
`;
const CntTxt = styled.span`
  width: 0;
  font-weight: 400;
  font-size: 11px;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
const ButtonContainer = styled.div`
  position: fixed;
  box-sizing: border-box;
  z-index: 3;
  bottom: 0;
  width: 100%;
  padding: 4px 16px 16px 16px;
  display: flex;
  gap: 10px;
  background: #fff;
  &::before {
    content: "";
    position: absolute;
    top: -19px;
    left: 0;
    width: 100%;
    height: 20px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 100%);
    z-index: 4;
  }
`;
const Button = styled.button<{ $selectedReason: number }>`
  box-sizing: border-box;
  z-index: 3;
  display: flex;
  height: 48px;
  padding: 14px 0px;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: center;
  border-radius: 50px;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
  margin-top: ${(props) => (props.$selectedReason !== 4 ? "2.5rem" : "0")};
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
