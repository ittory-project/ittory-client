import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import X from "../../../../public/assets/x.svg";
import calender from "../../../../public/assets/calendar.svg";
import BottomSheet from "./BotttomSheet";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { getMyPage } from "../../../api/service/MemberService";
import { useNavigate } from "react-router-dom";

interface Props {
  myName: string;
  setMyName: React.Dispatch<React.SetStateAction<string>>;
  receiverName: string;
  setReceiverName: React.Dispatch<React.SetStateAction<string>>;
  deliverDay: Date | null | string;
  setDeliverDay: React.Dispatch<React.SetStateAction<Date | null | string>>;
  setViewCoverDeco: React.Dispatch<React.SetStateAction<boolean>>;
  setViewStartpage: React.Dispatch<React.SetStateAction<boolean>>;
}

//포커스가 두번째부터 이루어짐

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  //const keyboardRef = useRef<HTMLInputElement | null>(null);
  const receiverInputRef = useRef<HTMLInputElement | null>(null);
  const myNameInputRef = useRef<HTMLInputElement | null>(null);
  const [focusedField, setFocusedField] = useState<
    "receiver" | "myName" | null
  >(null);
  const [name, setName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPageData = async () => {
      try {
        const myPageData = await getMyPage();
        setName(myPageData.name);
      } catch (err) {
        console.error("Error fetching my page data:", err);
      }
    };
    fetchMyPageData();
  }, []);

  const handleCancel = () => {
    navigate("/");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const keyboardHeight =
          window.innerHeight - window.visualViewport.height; // 키보드 높이 계산
        if (keyboardHeight > 0) {
          if (window.innerWidth < 850) {
            setKeyboardVisible(true);
          } else {
            setKeyboardVisible(false);
          }
        } else {
          setKeyboardVisible(false);
        }

        console.log(window.innerHeight);
        console.log(window.visualViewport.height);
        console.log(keyboardHeight);
      }
    };

    window.visualViewport?.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("scroll", handleResize);

    handleResize();

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("scroll", handleResize);
    };
  }, []);

  const handleFocus = (field: "receiver" | "myName") => {
    setFocusedField(field); // 포커스된 필드를 추적
  };

  /*useEffect(() => {
    if (keyboardVisible) {
      if (focusedField === "receiver") {
        receiverInputRef.current?.focus();
      } else if (focusedField === "myName") {
        myNameInputRef.current?.focus();
      }
    }
  }, [keyboardVisible, focusedField]);*/

  // 처음 focus될 때 keyboardVisible을 강제로 true로 설정
  useEffect(() => {
    if (focusedField) {
      if (keyboardVisible) {
        if (focusedField === "receiver" && receiverInputRef.current) {
          receiverInputRef.current.focus();
        } else if (focusedField === "myName" && myNameInputRef.current) {
          myNameInputRef.current.focus();
        }
      } else {
        if (focusedField === "receiver" && receiverInputRef.current) {
          receiverInputRef.current.focus();
        } else if (focusedField === "myName" && myNameInputRef.current) {
          myNameInputRef.current.focus();
        }
      }
    }
  }, [focusedField, keyboardVisible]);

  return (
    <BackGround>
      {isModalOpen && <Overlay />}
      <Cancel onClick={handleCancel}>
        <img src={X} alt="X Icon" style={{ width: "14px", height: "14px" }} />
      </Cancel>
      <Container>
        <Title $keyboardVisible={keyboardVisible}>
          <Text>{name}님,</Text>
          <Text>같이 편지를 만들어봐요!</Text>
        </Title>
        <MainCotainer
          $shiftup={String(keyboardVisible)}
          $isopen={String(isModalOpen)}
        >
          <InputBox>
            <InputLogo>받는 사람</InputLogo>
            <Input
              //ref={keyboardRef}
              ref={receiverInputRef}
              onFocus={() => handleFocus("receiver")}
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
              $minLength={1}
              $maxLength={12}
              spellCheck="false"
            />
          </InputBox>
          <InputBox>
            <InputLogo>내 이름</InputLogo>
            <Input
              //ref={keyboardRef}
              ref={myNameInputRef}
              onFocus={() => handleFocus("myName")}
              required
              placeholder="5자까지 입력할 수 있어요"
              type="text"
              value={myName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.value.length > 5) {
                  e.target.value = e.target.value.slice(0, 5);
                }
                setMyName(e.target.value);
              }}
              $minLength={1}
              $maxLength={5}
              spellCheck="false"
            />
          </InputBox>
          <InputBox>
            <InputLogo>전달 날짜</InputLogo>
            <InputBoxRow
              onClick={() => {
                openModal();
              }}
            >
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
              <Calender>
                <img
                  src={calender}
                  alt="calender Icon"
                  style={{ width: "18px", height: "19px" }}
                />
              </Calender>
            </InputBoxRow>
          </InputBox>
        </MainCotainer>
      </Container>
      {myName === "" || receiverName === "" || deliverDay === null ? (
        <Button
          disabled={true}
          style={{ background: "#ced4da" }}
          $keyboardVisible={keyboardVisible}
        >
          <ButtonTxt>다음</ButtonTxt>
        </Button>
      ) : (
        <Button
          $keyboardVisible={keyboardVisible}
          style={{
            background: "#FFA256",
            boxShadow:
              "1px -1px 0.4px 0px rgba(0, 0, 0, 0.14), 1px 1px 0.4px 0px rgba(255, 255, 255, 0.30)",
          }}
          onClick={() => {
            localStorage.setItem("receiver", receiverName);
            localStorage.setItem("myName", myName);
            localStorage.setItem("Date", String(deliverDay));
            setViewCoverDeco(true);
            setViewStartpage(false);
          }}
        >
          <ButtonTxt>다음</ButtonTxt>
        </Button>
      )}
      {isModalOpen && (
        <BottomSheet
          deliverDay={deliverDay}
          setDeliverDay={setDeliverDay}
          setIsModalOpen={setIsModalOpen}
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
  height: calc(var(--vh, 1vh) * 100);
  width: 100%;
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
const Cancel = styled.span`
  position: absolute;
  cursor: pointer;
  top: 10px;
  right: 16px;
`;
const Container = styled.div`
  margin-top: 48px;
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1 0 0;
  padding-right: 24px;
  padding-left: 24px;
  gap: 24px;
`;
const Title = styled.div<{ $keyboardVisible: boolean }>`
  display: flex;
  margin-top: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  display: ${(props) => (props.$keyboardVisible ? "none" : "flex")};
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
const MainCotainer = styled.div<{ $shiftup?: string; $isopen?: string }>`
  display: flex;
  width: 100%;
  padding: 20px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 22px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0px 0px 6px 0px rgba(36, 51, 72, 0.08);
  transition: transform 0.3s ease;
  transform: ${(props) =>
    props.$shiftup ? "translateY(0.8rem)" : "translateY(0)"};
`;
const InputBox = styled.div`
  display: flex;
  width: 232px;
  flex-direction: column;
  justify-content: center;
  margin-top: 0;
  margin-bottom: 4px;
  height: 60px;
  position: relative;
  border-bottom: 1px dashed #dee2e6;
`;
const InputLogo = styled.div`
  color: #495057;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: 11px;
  width: 100%;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.5px;
  position: absolute; /* 위치 고정 */
  top: 0; /* 고정 위치 */
  left: 0;
`;
const Input = styled.input<{ $minLength?: number; $maxLength?: number }>`
  width: 232px;
  height: 26px;
  border: 0;
  padding-left: 0;
  margin-top: 28px;
  margin-bottom: 6px;
  background-color: #ffffff;
  cursor: pointer;
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
  cursor: pointer;
  margin-bottom: 6px;
`;
const SelectDate = styled.span`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  width: 100%;
  border: 0;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.5px;
  margin-top: 28px;
`;
const Calender = styled.span`
  position: absolute;
  cursor: pointer;
  right: 0;
  margin-top: 28px;
`;
const Button = styled.button<{ $keyboardVisible: boolean }>`
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

  // 키보드가 보일 때 버튼 숨기기
  display: ${(props) => (props.$keyboardVisible ? "none" : "flex")};
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
