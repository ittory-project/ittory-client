import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Pagination } from '../common/Pagination';
import { useLocation } from 'react-router-dom';

function Query() {
  return new URLSearchParams(useLocation().search);
}

const coverImages = {
  img: '/img/cover/orange.svg'
};

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
        <CoverContainer>
          <CoverImage src={coverImages.img} alt="Cover" />
          <CoverContent>
            <TitleDiv>일이삼사오육칠팔구십일이</TitleDiv>
            <DateDiv>2024. 08. 21 (수)</DateDiv>
            <PhotoDiv>
              <ProfileImage src={'/img/profile.png'} alt="Profile" />
            </PhotoDiv>
            <DescriptionDiv>
              일이삼사오, 일이삼사오, 일이삼사오, 일이삼사오, 일이삼사오
            </DescriptionDiv>
          </CoverContent>
        </CoverContainer>
      );
    } else {
      return <LetterContent />;
    }
  };

  return (
    <Background>
      <ToDiv>To. {'선재'}</ToDiv>
      {renderPageContent()}
      <Pagination totalPages={14} />
    </Background>
  );
};

const LetterContent = () => {
  return (
    <CoverContainer>
      <ProductImage src='/img/cover/product.svg' />
      <ContentTitle>편지 내용 제목</ContentTitle>
      <ContentText>
      </ContentText>
    </CoverContainer>
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
  overflow: hidden;
`;

const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const CoverContent = styled.div`
  position: relative;
  z-index: 2;
  padding: 20px;
  color: #333;
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

const TitleDiv = styled.div`
  font-size: 22px;
  display: flex;
  font-weight: bold;
  margin-bottom: 10px;
  justify-content: center;
  overflow: hidden;
  color: var(--color-black-white-white, #FFF);
  text-align: center;
  text-overflow: ellipsis;
  text-shadow: 0px 2px 14px #EB9F0C;
  font-family: var(--Typography-family-number, "Gmarket Sans");
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 120% */
  letter-spacing: -0.5px;
`;

const DateDiv = styled.div`
  font-size: 16px;
  display: flex;
  color: #666;
  margin-bottom: 20px;
  justify-content: center;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.80);
  text-align: center;
  text-overflow: ellipsis;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: var(--Typography-size-2xs, 11px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-2xs, 16px); /* 145.455% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const PhotoDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 60px;
`;

const ProfileImage = styled.img`
  width: 164px;
  height: 164px;
  border-radius: 30px;
  object-fit: cover;
`;

const DescriptionDiv = styled.div`
  height: 16px;
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
  overflow: hidden;
  color: #715142;
  text-align: center;
  text-overflow: ellipsis;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: var(--Typography-size-2xs, 11px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-2xs, 16px); /* 145.455% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const ProductImage = styled.img`
  display: flex;
  margin: 3px 4px 3px auto;
  justify-content: center;
  align-items: center;
`;

const ContentTitle = styled.h1`
  font-size: 24px;
  color: #D2691E;
  margin-bottom: 16px;
`;

const ContentText = styled.p`
  font-size: 16px;
  color: #333;
  line-height: 1.6;
`;