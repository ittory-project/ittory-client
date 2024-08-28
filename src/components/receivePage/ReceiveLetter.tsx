import { useState } from 'react';
import styled from 'styled-components';
import { Pagination } from '../common/Pagination';

const coverImages = {
  img: '/img/cover/orange.svg'
};

export const ReceiveLetter = () => {
  const totalPages = 14;

  return (
    <Background>
      <ToDiv>To. {'선재'}</ToDiv>
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
      <Pagination totalPages={totalPages} />
    </Background>
  );
};

const Background = styled.div`
  height: 100vh;
  background: linear-gradient(180deg, #F3C183 0%, #F0F5BF 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
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
  border-radius: 12px;
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;

const PaginationButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationText = styled.span`
  width: 46px;
  margin: 0 10px;
  font-size: 18px;
  color: #333;
  display: flex;
  padding: var(--Border-Radius-radius_200, 6px) var(--Border-Radius-radius_300, 8px);
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: var(--Border-Radius-radius_circle, 50px);
  background: rgba(248, 249, 250, 0.50);
  backdrop-filter: blur(2px);
  color: var(--Color-secondary-navy, #1C2231);
  text-align: center;

  /* caption/number_large */
  font-family: var(--Typography-family-number, "Gmarket Sans");
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.048px;
`;
