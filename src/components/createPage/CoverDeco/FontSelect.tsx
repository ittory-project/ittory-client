import React, { useEffect } from "react";
import styled from "styled-components";
import { fontProps } from "./CoverStyle";

interface Props {
  font: string;
  fonts: fontProps[];
  setFont: React.Dispatch<React.SetStateAction<string>>;
  setSelect: React.Dispatch<React.SetStateAction<string>>;
  select: string;
  setSelectFid: React.Dispatch<React.SetStateAction<number>>;
  setSelectId: React.Dispatch<React.SetStateAction<number>>;
}

export default function FontSelect({
  font,
  fonts,
  setFont,
  setSelectFid,
  setSelect,
  select,
  setSelectId,
}: Props) {
  const handleFontChange = (fontFamily: string, fontId: number) => {
    setFont(fontFamily);
    setSelect(fontFamily);
    setSelectFid(fontId);
    setSelectId(fontId);
    console.log(fontId);
  };

  useEffect(() => {
    console.log(select);
    if (select !== "") {
      setFont(select);
    } else {
      setFont(fonts[0].value);
    }
  }, []);

  return (
    <Container>
      <FontSelectorContainer>
        {fonts.map((fontlist) => (
          <FontItem
            key={fontlist.id}
            $fontFamily={fontlist.value}
            $selected={fontlist.value === font}
            onClick={() => handleFontChange(fontlist.value, fontlist.id)}
          >
            <Fonttxt
              $fontFamily={fontlist.value}
              $selected={fontlist.value === font}
            >
              {fontlist.name}
            </Fonttxt>
          </FontItem>
        ))}
      </FontSelectorContainer>
    </Container>
  );
}

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
  gap: 0.4rem;
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
const FontItem = styled.div<{ $fontFamily: string; $selected: boolean }>`
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
    props.$selected ? "1px solid #ffa256" : "1px solid #ced4da"};
  background: ${(props) => (props.$selected ? "#fff2e8" : "#f1f3f5")};
  cursor: pointer;
  transition: background-color 0.3s;
`;
const Fonttxt = styled.span<{ $fontFamily: string; $selected: boolean }>`
  color: ${(props) => (props.$selected ? "#ffa256" : "#858e96")};
  font-family: ${(props) => props.$fontFamily};
  font-size: ${(props) =>
    props.$fontFamily === "Ownglyph_UNZ-Rg" ? "20px" : "14px"};
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.5px;
  margin-top: ${(props) =>
    props.$fontFamily === "GmarketSans" ? "3px" : "1px"};
`;
