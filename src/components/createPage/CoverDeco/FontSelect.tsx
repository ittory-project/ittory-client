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
        {fonts.map((fontlist) =>
          fontlist.family === font ? (
            <Selected
              key={fontlist.family}
              fontFamily={fontlist.family}
              style={{ fontFamily: fontlist.family }}
            >
              {fontlist.name}
            </Selected>
          ) : (
            <Unselected
              key={fontlist.family}
              fontFamily={fontlist.family}
              onClick={() => handleFontChange(fontlist.family)}
              style={{ fontFamily: fontlist.family }}
            >
              {fontlist.name}
            </Unselected>
          )
        )}
      </FontSelectorContainer>
    </Container>
  );
}

// 스타일 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
`;

const FontSelectorContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const Selected = styled.div<{ fontFamily: string }>`
  display: flex;
  width: 80px;
  height: 34px;
  padding: 6px 16px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 50px;
  border: 1px solid #ffa256;
  background: #fff2e8;
  color: #ffa256;
  font-size: ${(props) =>
    props.fontFamily === "Ownglyph_UNZ-Rg" ? "18px" : "14px"};
  font-weight: 500;
`;
const Unselected = styled.div<{ fontFamily: string }>`
  display: flex;
  width: 80px;
  height: 34px;
  padding: 6px 16px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 50px;
  border: 1px solid #ced4da;
  background: #f1f3f5;
  color: #858e96;
  font-size: ${(props) =>
    props.fontFamily === "Ownglyph_UNZ-Rg" ? "18px" : "14px"};
  font-weight: 400;
`;
