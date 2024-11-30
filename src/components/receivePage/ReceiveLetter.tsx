import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Pagination } from '../common/Pagination';
import { decodeLetterId } from '../../api/config/base64';
import { ReceiveLetterCover } from './ReceiveLetterCover';
import { ReceiveLetterSave } from './ReceiveLetterSave';
import { ReceiveLetterContents } from './ReceiveLetterContents';
import { LetterDetailGetResponse } from '../../api/model/LetterModel';
import { FontGetResponse } from '../../api/model/FontModel';
import { CoverTypeGetResponse } from '../../api/model/CoverTypeModel';
import { getLetterDetailInfo } from '../../api/service/LetterService';
import { getFontById } from '../../api/service/FontService';
import { getCoverTypeById } from '../../api/service/CoverTypeService';

function Query() {
  return new URLSearchParams(useLocation().search);
}

export const ReceiveLetter = () => {
  const { letterId } = useParams();
  const [letterNumId] = useState(decodeLetterId(String(letterId)));
  const [letterInfo, setLetterInfo] = useState<LetterDetailGetResponse>();
  const [partiList, setPartiList] = useState<string>('');
  const [font, setFont] = useState<FontGetResponse>();
  const [coverType, setCoverType] = useState<CoverTypeGetResponse>()
  const [elementLength, setElementLength] = useState<number>(0);

  const query = Query();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const page = Number(query.get("page")) || 1;
    setCurrentPage(page);
  }, [query]);

  const getSharedLetter = async (letterNumId: number) => {
    const response = await getLetterDetailInfo(letterNumId)
    setLetterInfo(response)
    const nicknameString = response.elements
      .map((element) => element.nickname)
      .join(", ");
    setPartiList(nicknameString)
    setElementLength(response.elements.length)
  }

  const getSharedLetterStyle = async () => {
    if (letterInfo) {
      const fontResponse = await getFontById(letterInfo.fontId)
      if (fontResponse) {
        setFont(fontResponse)
      }
      const coverTypeResponse = await getCoverTypeById(letterInfo.coverTypeId)
      if (coverTypeResponse) {
        setCoverType(coverTypeResponse)
      }
    }
  }

  useEffect (() => {
    getSharedLetter(letterNumId)
  }, [letterNumId])
  useEffect(() => {
    getSharedLetterStyle()
  }, [letterInfo])

  const renderPageContent = () => {
    if (!letterInfo || !coverType || !font) {
      return <div>편지를 찾을 수 없습니다.</div>
    } else {
      if (currentPage === 1) 
        return  <ReceiveLetterCover letterStyle={coverType} letterFontStyle={font} letterContent={letterInfo} partiList={partiList}/> ;
      else if (currentPage === elementLength + 1) 
        return <ReceiveLetterSave /> ;
      else 
        return <ReceiveLetterContents letterFontStyle={font} letterContent={letterInfo.elements[currentPage - 2]}/>;
    }
  };

  return (
    (letterInfo && coverType && font && elementLength > 0) ? (
      <Background $backgroundimg={"" + coverType.outputBackgroundImageUrl}>
        <ToDiv>To. {'선재'}</ToDiv>
        <CoverContainer $boardimg={"" + coverType.outputBoardImageUrl}>
          {renderPageContent()}
        </CoverContainer>
        <Pagination totalPages={elementLength + 1} />
      </Background>
    ) : (
      <div>편지를 불러올 수 없습니다.</div>
    )
  );
};

const Background = styled.div<{ $backgroundimg: string }>`
  width: 100%;
  height: 100vh;
  background-image: url(${(props) => props.$backgroundimg});
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CoverContainer = styled.div<{ $boardimg: string }>`
  position: relative;
  width: 272px;
  height: 355px;
  flex-shrink: 0;
  border-radius: 5px 15px 15px 5px;
  background-image: url(${(props) => props.$boardimg})
  background-size: cover;
  box-shadow: 0 2px 1px rgba(0,0,0,0.09), 
              0 4px 2px rgba(0,0,0,0.09), 
              0 8px 4px rgba(0,0,0,0.09), 
              0 16px 8px rgba(0,0,0,0.09),
              0 32px 16px rgba(0,0,0,0.09);
`;

const ToDiv = styled.div`
  font-size: 24px;
  margin-bottom: 40px;
  padding: 0px 10px;
  color: var(--color-black-white-white, #FFF);
  text-align: center;

  /* title/base_bold */
  font-family: var(--Typography-family-title, SUIT);
  font-size: var(--Typography-size-base, 16px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-s, 24px); /* 150% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);

  border-bottom: 2px dashed rgba(255, 255, 255, 0.50);
`;