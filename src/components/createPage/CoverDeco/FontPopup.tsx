import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FontSelect from "./FontSelect";
import _Line from "../../../../public/assets/_line.svg";
import { getAllFont } from "../../../api/service/FontService";
import { fontProps } from "./CoverStyle";

interface Props {
  font: string;
  fonts: fontProps[];
  setFont: React.Dispatch<React.SetStateAction<string>>;
  setFontPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FontPopup({
  font,
  fonts,
  setFont,
  setFontPopup,
}: Props) {
  const handleButton = () => {
    setFontPopup(false);
  };

  return (
    <BackGround>
      <FontContainer>
        <FontSelect font={font} fonts={fonts} setFont={setFont} />
      </FontContainer>
      <Line src={_Line} />
      <Button onClick={handleButton}>완료</Button>
    </BackGround>
  );
}

const BackGround = styled.div`
  display: flex;
  width: 100%;
  height: 159px;
  position: absolute;
  bottom: 0px;
  border-radius: 20px 20px 0px 0px;
  background: #fff;
  box-shadow: 0px -4px 14px 0px rgba(0, 0, 0, 0.1);
  overflow-x: hidden;
`;
const FontContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 15px;
  flex-direction: column;
  align-items: center;
  overflow-x: auto;
`;
const Line = styled.img`
  width: 100%;
  position: absolute;
  left: 0;
  margin-top: 75px;
`;
const Button = styled.button`
  overflow: hidden;
  position: fixed;
  width: 288px;
  cursor: pointer;
  display: flex;
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
`;
