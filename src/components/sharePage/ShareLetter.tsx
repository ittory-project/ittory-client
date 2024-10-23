import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Pagination } from '../common/Pagination';
import { useLocation } from 'react-router-dom';
import { ReceiveLetterCover } from '../receivePage/ReceiveLetterCover';
import { ReceiveLetterContents } from '../receivePage/ReceiveLetterContents';

function Query() {
  return new URLSearchParams(useLocation().search);
}

export const ShareLetter = () => {
  const query = Query();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const page = Number(query.get("page")) || 1;
    setCurrentPage(page);
  }, [query]);

  const renderPageContent = () => {
    if (currentPage === 1) 
      return  <ReceiveLetterCover /> ;
    else 
      return <ReceiveLetterContents />;
  };

  const createShare = async () => {
    try {
      await navigator.share({
        title: '링크요',
        text: '링크를 생성할 수 있을 것인가',
        url: `${import.meta.env.VITE_SERVER_URL}/receive?letter=${encodeURIComponent("편지 번호")}?to=${encodeURIComponent("받을 사람")}`,
      });
      console.log('공유 성공');
    } catch (e) {
      console.log('공유 실패');
    }
  }

  return (
    <Background>
      <ToDiv>To. {'선재'}</ToDiv>
      <CoverContainer>
        {renderPageContent()}
      </CoverContainer>
      <Pagination totalPages={14} />
      <BtnContainer>
        <StoreBtn>편지함에 보관하기</StoreBtn>
        <ShareBtn onClick={createShare}>지금 공유하기</ShareBtn>
      </BtnContainer>
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

const BtnContainer = styled.div`
  display: flex;
  width: 320px;
  padding: 10px 16px 5px 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const StoreBtn = styled.button`
  display: flex;
  width: 140px;
  height: 48px;
  padding: var(--Typography-size-s, 14px) 20px;
  justify-content: center;
  align-items: center;
  gap: var(--Border-Radius-radius_300, 8px);
  border-radius: var(--Border-Radius-radius_circle, 50px);
  background: var(--color-black-white-white, #FFF);
  box-shadow: -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset, 1px 1px 0.4px 0px rgba(255, 255, 255, 0.30) inset;
  color: var(--Color-grayscale-gray700, #495057);

  /* body/small_bold */
  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);

  &:focus {
    outline: none;
  }
`;

const ShareBtn = styled.button`
  display: flex;
  width: 140px;
  height: 48px;
  padding: var(--Typography-size-s, 14px) 20px;
  justify-content: center;
  align-items: center;
  gap: var(--Border-Radius-radius_300, 8px);
  border-radius: var(--Border-Radius-radius_circle, 50px);
  background: var(--Color-primary-orange, #FFA256);
  box-shadow: -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset, 1px 1px 0.4px 0px rgba(255, 255, 255, 0.30) inset;
  color: var(--color-black-white-white, #FFF);

  /* body/small_bold */
  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);

  &:focus {
    outline: none;
  }
`;
