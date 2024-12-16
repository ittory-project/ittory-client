import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FontSelect from "./FontSelect";
import _Line from "../../../../public/assets/_line.svg";
import { getAllFont } from "../../../api/service/FontService";
import { fontProps } from "./CoverStyle";

interface Props {
  font: string;
  fonts: fontProps[];
  setFontPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setFont: React.Dispatch<React.SetStateAction<string>>;
  fontPopup: boolean;
  setSelect: React.Dispatch<React.SetStateAction<string>>;
  select: string;
  setSelectFid: React.Dispatch<React.SetStateAction<number>>;
  setSelectfid: React.Dispatch<React.SetStateAction<number>>;
  selectfid: number;
}

export default function FontPopup({
  font,
  fonts,
  setFont,
  setFontPopup,
  fontPopup,
  setSelect,
  select,
  setSelectFid,
  setSelectfid,
  selectfid,
}: Props) {
  const [selected, setSelected] = useState<string>("서체 1");
  const [selectId, setSelectId] = useState<number>(1);
  const [bottomOffset, setBottomOffset] = useState<number>(0);

  useEffect(() => {
    setSelected(font);
    //setFont(font);
    setSelectId(selectfid);
  }, []);

  const handleButton = () => {
    setSelected(selected);
    setSelect(selected);
    setSelectfid(selectId);
    setFontPopup(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const keyboardHeight =
          window.innerHeight - window.visualViewport.height; // 키보드 높이 계산
        setBottomOffset(keyboardHeight > 0 ? keyboardHeight : 0); // 키보드 높이가 0 이상인 경우만 설정
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

  return (
    <BackGround $bottomOffset={bottomOffset}>
      <FontContainer>
        <FontSelect
          font={font}
          fonts={fonts}
          setFont={setFont}
          setSelect={setSelected}
          select={select}
          setSelectFid={setSelectfid}
          setSelectId={setSelectId}
        />
      </FontContainer>
      <Line src={_Line} />
      <Button onClick={handleButton}>완료</Button>
    </BackGround>
  );
}

const BackGround = styled.div<{ $bottomOffset: number }>`
  display: flex;
  width: 100%;
  z-index: 3;
  position: absolute;
  bottom: ${(props) => props.$bottomOffset - 2}px;
  border-radius: 20px 20px 0px 0px;
  background: #fff;
  box-shadow: 0px -4px 14px 0px rgba(0, 0, 0, 0.1);
  overflow-x: hidden;
  overflow-y: hidden;
  == @media (min-width: 431px) {
    height: 149px; // 데스크톱
  }

  @media (max-width: 430px) {
    height: 64px;
  }
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
const Button = styled.button`
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

  @media (min-width: 431px) {
    display: flex; // 데스크톱
  }

  @media (max-width: 430px) {
    display: none;
  }
`;
