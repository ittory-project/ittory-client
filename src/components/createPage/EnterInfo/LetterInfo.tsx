import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import X from "../../../../public/assets/x.svg";
import calender from "../../../../public/assets/calendar.svg";
import BottomSheet from "./BotttomSheet";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface Props {
  myName: string;
  setMyName: React.Dispatch<React.SetStateAction<string>>;
  receiverName: string;
  setReceiverName: React.Dispatch<React.SetStateAction<string>>;
  deliverDay: Date | null;
  setDeliverDay: React.Dispatch<React.SetStateAction<Date | null>>;
  setViewCoverDeco: React.Dispatch<React.SetStateAction<boolean>>;
  setViewStartpage: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LetterInfo({
  myName,
  setMyName,
  receiverName,
  setReceiverName,
  deliverDay,
  setDeliverDay,
  setViewCoverDeco,
  setViewStartpage,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const keyboardRef = useRef<HTMLElement | null>(null);

  const navigate = useNavigate();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleFocus = () => {
    setKeyboardVisible(true);
  };

  const handleBlur = () => {
    setKeyboardVisible(false);
  };
  /*
  const navigateToCoverDeco = () => {
    navigate("/CoverDeco");
  };
 
  useEffect(() => {
    const handleResize = () => {
      // 키패드가 나타나면 화면의 높이가 줄어드므로, 이를 감지
      if (window.innerHeight < window.outerHeight) {
        setKeyboardVisible(true);
      } else {
        setKeyboardVisible(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);*/

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        keyboardRef.current &&
        !keyboardRef.current.contains(e.target as Node)
      ) {
        handleBlur();
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [keyboardRef]);

  return (
    <BackGround>
      {isModalOpen && <Overlay />}
      <Cancel>
        <img src={X} alt="X Icon" style={{ width: "14px", height: "14px" }} />
      </Cancel>
      <Container>
        {!keyboardVisible && (
          <Title>
            <Text>카리나님,</Text>
            <Text>같이 편지를 만들어봐요!</Text>
          </Title>
        )}
        <MainCotainer shiftUp={keyboardVisible} isOpen={isModalOpen}>
          <InputBox>
            <InputLogo>받는 사람</InputLogo>
            <Input
              ref={keyboardRef}
              required
              placeholder="12자까지 입력할 수 있어요"
              type="text"
              value={receiverName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.value.length > 12) {
                  e.target.value = e.target.value.slice(0, 12);
                }
                setReceiverName(e.target.value);
              }}
              minlength="1"
              maxlength="12"
              onFocus={handleFocus}
              spellcheck="false"
              //onBlur={handleBlur}
            />
          </InputBox>
          <InputBox>
            <InputLogo>내 이름</InputLogo>
            <Input
              ref={keyboardRef}
              required
              placeholder="5자까지 입력할 수 있어요"
              type="text"
              value={myName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setKeyboardVisible(true);
                if (e.target.value.length > 5) {
                  e.target.value = e.target.value.slice(0, 5);
                }
                setMyName(e.target.value);
              }}
              minlength="1"
              maxlength="5"
              onFocus={handleFocus}
              spellcheck="false"
              //onBlur={handleBlur}
            />
          </InputBox>
          <InputBox>
            <InputLogo>전달 날짜</InputLogo>
            <InputBoxRow>
              {deliverDay === null ? (
                <SelectDate style={{ color: "#adb5bd" }}>
                  날짜를 선택해 주세요
                </SelectDate>
              ) : (
                <SelectDate style={{ color: "#212529" }}>
                  {`${format(deliverDay, "yyyy")}.`}
                  {`${format(deliverDay, "M")}.`}
                  {format(deliverDay, "d")}
                  {` (${format(deliverDay, "E", { locale: ko })})`}
                </SelectDate>
              )}
              <Calender
                onClick={() => {
                  openModal();
                  setKeyboardVisible(true);
                }}
                ref={keyboardRef}
              >
                <img
                  src={calender}
                  alt="calender Icon"
                  style={{ width: "24px", height: "24px" }}
                />
              </Calender>
            </InputBoxRow>
          </InputBox>
        </MainCotainer>
      </Container>
      {!keyboardVisible &&
        (myName === "" || receiverName === "" || deliverDay === null ? (
          <Button disabled={true} style={{ background: "#ced4da" }}>
            <ButtonTxt>다음</ButtonTxt>
          </Button>
        ) : (
          <Button
            style={{
              background: "#FFA256",
              boxShadow:
                "1px -1px 0.4px 0px rgba(0, 0, 0, 0.14), 1px 1px 0.4px 0px rgba(255, 255, 255, 0.30)",
            }}
            onClick={() => {
              setViewCoverDeco(true);
              setViewStartpage(false);
            }}
          >
            <ButtonTxt>다음</ButtonTxt>
          </Button>
        ))}
      {isModalOpen && (
        <BottomSheet
          deliverDay={deliverDay}
          setDeliverDay={setDeliverDay}
          setIsModalOpen={setIsModalOpen}
          setKeyboardVisible={setKeyboardVisible}
        />
      )}
    </BackGround>
  );
}
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  transition: background 0.3s ease;
  z-index: 99;
`;
const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
`;
const Container = styled.div`
  margin-top: 48px;
  display: flex;
  width: 19rem;
  align-items: center;
  flex-direction: column;
  flex: 1 0 0;
`;
const Cancel = styled.span`
  position: absolute;
  cursor: pointer;
  top: 10px;
  right: 16px;
`;
const Title = styled.div`
  display: flex;
  margin-top: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
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
const MainCotainer = styled.div<{ shiftUp: boolean; isOpen: boolean }>`
  display: flex;
  width: 16.5rem;
  height: 14.7rem;
  padding: 0.4rem 0.6rem 0.5rem 0.6rem;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0px 0px 6px 0px rgba(36, 51, 72, 0.08);
  transition: transform 0.3s ease;
  transform: ${(props) =>
    props.shiftUp ? "translateY(0.8rem)" : "translateY(0)"};
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
const InputBoxRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const SelectDate = styled.span`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
const Calender = styled.span`
  position: absolute;
  cursor: pointer;
  right: 1rem;
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
