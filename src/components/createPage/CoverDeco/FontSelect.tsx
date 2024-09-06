import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

interface Props {
  font: string;
  fonts: { name: string; family: string }[];
  setFont: React.Dispatch<React.SetStateAction<string>>;
}

export default function FontSelect({ font, fonts, setFont }: Props) {
  // 폰트 선택 핸들러
  const handleFontChange = (fontFamily: string) => {
    setFont(fontFamily);
    console.log("Selected Font:", fontFamily);
  };

  return (
    <Container>
      <FontSelectorContainer>
        {fonts.map((fontlist) => (
          <FontItem
            key={fontlist.family}
            fontFamily={fontlist.family}
            selected={fontlist.family === font}
            onClick={() => handleFontChange(fontlist.family)}
          >
            <Fonttxt
              fontFamily={fontlist.family}
              selected={fontlist.family === font}
            >
              {fontlist.name}
            </Fonttxt>
          </FontItem>
        ))}
      </FontSelectorContainer>
    </Container>
  );
}

// 스타일 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
`;

const FontSelectorContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  overflow-x: auto;
  padding: 11px 16px;
  white-space: nowrap;
  /* 스크롤바 스타일 (브라우저에 따라 다를 수 있음) */
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
`;
const FontItem = styled.div<{ fontFamily: string; selected: boolean }>`
  display: inline-flex;
  width: 80px;
  height: 34px;
  box-sizing: border-box;
  padding: 6px 16px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  text-align: center;
  border-radius: 50px;
  border: ${(props) =>
    props.selected ? "1px solid #ffa256" : "1px solid #ced4da"};
  background: ${(props) => (props.selected ? "#fff2e8" : "#f1f3f5")};
  cursor: pointer;
  transition: background-color 0.3s;
`;
const Fonttxt = styled.span<{ fontFamily: string; selected: boolean }>`
  color: ${(props) => (props.selected ? "#ffa256" : "#858e96")};
  font-family: ${(props) => props.fontFamily};
  font-size: ${(props) =>
    props.fontFamily === "Ownglyph_UNZ-Rg" ? "20px" : "14px"};
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.5px;
  margin-top: ${(props) =>
    props.fontFamily === "GmarketSans" ? "3px" : "1px"};
`;
