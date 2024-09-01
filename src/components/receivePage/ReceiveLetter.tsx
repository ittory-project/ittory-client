import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Pagination } from '../common/Pagination';
import { useLocation } from 'react-router-dom';
import { ReceiveLetterCover } from './ReceiveLetterCover';
import { ReceiveLetterContents } from './ReceiveLetterContents';

function Query() {
  return new URLSearchParams(useLocation().search);
}

export const ReceiveLetter = () => {
  const query = Query();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const page = Number(query.get("page")) || 1;
    setCurrentPage(page);
  }, [query]);

  const renderPageContent = () => {
    if (currentPage === 1) {
      return (
        <ReceiveLetterCover />
      );
    } else {
      return <ReceiveLetterContents />;
    }
  };

  return (
    <Background>
      <ToDiv>To. {'선재'}</ToDiv>
      <CoverContainer>
        {renderPageContent()}
      </CoverContainer>
      <Pagination totalPages={14} />
    </Background>
  );
};

const Background = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #F3C183 0%, #F0F5BF 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CoverContainer = styled.div`
  position: relative;
  width: 272px;
  height: 355px;
  flex-shrink: 0;
  border-radius: 5px 15px 15px 5px;
  background: linear-gradient(180deg, #F4AC1E 0%, #FFC85E 2.63%, #FFBF44 4.31%, #FFBB35 35%, #FFC34E 100%);
  box-shadow: 0 2px 1px rgba(0,0,0,0.09), 
              0 4px 2px rgba(0,0,0,0.09), 
              0 8px 4px rgba(0,0,0,0.09), 
              0 16px 8px rgba(0,0,0,0.09),
              0 32px 16px rgba(0,0,0,0.09);
  background-color: white;

`;

const ToDiv = styled.div`
  font-size: 24px;
  margin-bottom: 40px;
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