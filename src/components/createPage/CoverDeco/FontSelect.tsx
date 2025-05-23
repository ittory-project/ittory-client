import React, { useEffect } from 'react';

import styled from 'styled-components';

import { SessionLogger } from '../../../utils/SessionLogger';
import { fontProps } from './CoverStyle';

const logger = new SessionLogger('create');

interface Props {
  font: string;
  fonts: fontProps[];
  setFont: React.Dispatch<React.SetStateAction<string>>;
  setSelect: React.Dispatch<React.SetStateAction<string>>;
  select: string;
  setSelectFid: React.Dispatch<React.SetStateAction<number>>;
  setSelectId: React.Dispatch<React.SetStateAction<number>>;
  selectfid: number;
  handlePopupClick: (_e: React.MouseEvent) => void;
}

export default function FontSelect({
  font,
  fonts,
  setFont,
  setSelectFid,
  setSelect,
  select,
  setSelectId,
  handlePopupClick,
}: Props) {
  const handleFontChange = (fontFamily: string, fontId: number) => {
    logger.debug('폰트 변경: ', fontFamily);
    setFont(fontFamily);
    setSelect(fontFamily);
    setSelectFid(fontId);
    setSelectId(fontId);
  };

  useEffect(() => {
    logger.debug('폰트 선택: ', select);
    if (select === '') {
      setFont(fonts[0].value);
      setSelectId(fonts[0].id);
      setSelectFid(fonts[0].id);
    } else {
      setFont(select);
      setSelect(select);
    }
  }, []);

  return (
    <Container className="fontselect" onClick={handlePopupClick}>
      <FontSelectorContainer>
        {fonts.map((fontlist) => (
          <FontItem
            key={fontlist.id}
            $fontFamily={fontlist.value}
            $selected={fontlist.value === font}
            onClick={(e) => {
              handleFontChange(fontlist.value, fontlist.id);
              handlePopupClick(e);
              e.stopPropagation(); // FontItem 클릭 시 부모 컨테이너의 클릭 이벤트가 실행되지 않도록
            }} // 폰트 변경 시 포커스를 유지하고 키보드도 내려가지 않게 함
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
  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  align-items: flex-start;

  width: 100%;
`;

const FontSelectorContainer = styled.div`
  display: flex;

  flex-direction: row;

  gap: 0.4rem;

  padding: 11px 16px;

  overflow-x: auto;

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
  box-sizing: border-box;
  display: inline-flex;

  gap: 4px;
  align-items: center;
  justify-content: center;

  width: 80px;
  height: 34px;

  text-align: center;

  cursor: pointer;

  background: ${(props) => (props.$selected ? '#fff2e8' : '#f1f3f5')};
  border: ${(props) =>
    props.$selected ? '1px solid #ffa256' : '1px solid #ced4da'};
  border-radius: 50px;

  transition: background-color 0.3s;
`;
const Fonttxt = styled.span<{ $fontFamily: string; $selected: boolean }>`
  margin-top: ${(props) =>
    props.$fontFamily === 'GmarketSans' ? '3px' : '1px'};

  font-family: ${(props) => props.$fontFamily};
  font-size: ${(props) =>
    props.$fontFamily === 'Ownglyph_UNZ-Rg' ? '20px' : '14px'};
  font-weight: ${(props) => (props.$fontFamily === 'GmarketSans' ? 500 : 400)};

  line-height: 20px;

  color: ${(props) => (props.$selected ? '#ffa256' : '#858e96')};

  letter-spacing: -0.5px;
`;
