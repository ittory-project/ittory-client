import React, { useState, useEffect, forwardRef } from "react";
import styled from "styled-components";
import FontSelect from "./FontSelect";
import _Line from "../../../../public/assets/_line.svg";
import { fontProps } from "./CoverStyle";

interface Props {
  font: string;
  fonts: fontProps[];
  setFontPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setFont: React.Dispatch<React.SetStateAction<string>>;
  fontPopup: boolean;
  setSelect: React.Dispatch<React.SetStateAction<string>>;
  select: string;
  setSelectfid: React.Dispatch<React.SetStateAction<number>>;
  selectfid: number;
}

const FontPopup = forwardRef<HTMLDivElement, Props>(
  (
    {
      font,
      fonts,
      setFont,
      setFontPopup,
      setSelect,
      select,
      setSelectfid,
      selectfid,
    },
    ref
  ) => {
    const [selected, setSelected] = useState<string>("");
    const [selectId, setSelectId] = useState<number>(1);
    const [bottomOffset, setBottomOffset] = useState<number>(0);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);
    const [, setIsCompleted] = useState<boolean>(false);

    useEffect(() => {
      setSelected(font);
      setFont(font);
      setSelectId(selectfid);
      setSelectfid(selectfid);
    }, []);

    const handleButton = () => {
      console.log(selected);
      console.log(selectId);
      setSelected(selected);
      setSelect(selected);
      setSelectfid(selectId);
      setIsCompleted(true);
      setFontPopup(false);
    };

    useEffect(() => {
      const handleResize = () => {
        if (window.visualViewport) {
          const keyboardHeight =
            window.innerHeight - window.visualViewport.height; // 키보드 높이 계산
          if (keyboardHeight > 0) {
            if (window.innerWidth < 850) {
              setIsKeyboardVisible(true);
              setBottomOffset(keyboardHeight); // 키보드 높이가 0 이상인 경우만 설정
            } else {
              setIsKeyboardVisible(false);
              setBottomOffset(0);
            }
          } else {
            setIsKeyboardVisible(false);
            setBottomOffset(0);
          }
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

    const handleInputBlur = () => {
      // 입력 필드에서 blur 발생 시 서체 선택 영역을 내려가도록 처리
      setIsCompleted(true); // 완료 상태로 설정
    };

    return (
      <div ref={ref} className={ParentDiv}>
        <BackGround
          $bottomOffset={bottomOffset}
          $isKeyboardVisible={isKeyboardVisible}
        >
          <FontContainer>
            <FontSelect
              font={font}
              fonts={fonts}
              setFont={setFont}
              setSelect={setSelected}
              select={select}
              selectfid={selectfid}
              setSelectFid={setSelectfid}
              setSelectId={setSelectId}
            />
          </FontContainer>
          <Line src={_Line} />
          <Button onClick={handleButton} $isKeyboardVisible={isKeyboardVisible}>
            완료
          </Button>
        </BackGround>
        {/* 키보드가 올라오면 이 필드가 focus되며 완료버튼을 눌렀을 때 키보드가 내려가게 처리 */}
        <input
          type="text"
          style={{ opacity: 0 }}
          onBlur={handleInputBlur} // blur 발생 시 서체 선택 영역을 내려가도록 설정
        />
      </div>
    );
  }
);

export default FontPopup;

const ParentDiv = styled.div`
  position: relative;
  width: 100%;
`;

const BackGround = styled.div<{
  $bottomOffset: number;
  $isKeyboardVisible: boolean;
}>`
  display: flex;
  width: 100%;
  z-index: 100;
  position: absolute;
  bottom: ${(props) => props.$bottomOffset - 2}px;
  border-radius: 20px 20px 0px 0px;
  background: #fff;
  box-shadow: 0px -4px 14px 0px rgba(0, 0, 0, 0.1);
  overflow-x: hidden;
  overflow-y: hidden;
  height: ${(props) => (props.$isKeyboardVisible ? "64px" : "149px")};

  transition:
    bottom 0.3s ease,
    height 0.3s ease;
`;

const FontContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 5px;
  flex-direction: column;
  align-items: center;
  overflow-x: auto;
  z-index: 10;
  overflow-y: hidden;
`;
const Line = styled.img`
  width: 100%;
  position: absolute;
  left: 0;
  margin-top: 65px;
`;
const Button = styled.button<{ $isKeyboardVisible: boolean }>`
  overflow: hidden;
  z-index: 10;
  position: fixed;
  width: 288px;
  cursor: pointer;
  height: 48px;
  padding: 14px 20px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  bottom: 20px;
  align-self: stretch;
  border-radius: 50px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: var(--Typography-size-base, 16px);
  font-style: normal;
  font-weight: 700;
  background: #343a40;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
  display: ${(props) => (props.$isKeyboardVisible ? "none" : "flex")};
`;
