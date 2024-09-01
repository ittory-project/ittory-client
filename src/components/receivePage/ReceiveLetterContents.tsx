import styled from 'styled-components';

export const ReceiveLetterContents = () => {
  return (
    <>
      <ProductLeftSide src='/img/cover/left.svg' />
      <ProductRightSide src='/img/cover/product.svg' />
      <ContentImg src='/img/profile.png' />
      <Content>편지 내용</Content>
      <ContentWriter>카리나</ContentWriter>
    </>
  );
};

const ProductRightSide = styled.img`
  display: flex;
  margin: 3.5px 4px 3.5px auto;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const ProductLeftSide = styled.img`
  width: 67px;
  height: 369px;
  object-fit: fill;
  position: absolute;
  left: -51px;
  top: -7px;
`;

const ContentImg = styled.img`
  width: 182px;
  height: 182px;
  border-radius: var(--Border-Radius-radius_400, 12px);
  position: absolute;
  top: 35px;
  left: 50%;
  transform: translate(-47%, -0%);
`;

const Content = styled.div`
  display: flex;
  height: 41px;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  color: var(--Color-grayscale-gray900, #212529);
  text-align: center;

  /* body/small_medium */
  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 500;
  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
  
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-47%, -0%);
`;

const ContentWriter = styled.div`
  font-size: 16px;
  color: #333;
  line-height: 1.6;

  color: var(--Color-grayscale-gray600, #868E96);
  text-align: right;

  /* caption/2xsmall */
  font-family: var(--Typography-family-caption, SUIT);
  font-size: var(--Typography-size-2xs, 11px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--Typography-line_height-2xs, 16px); /* 145.455% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
  
  position: absolute;
  top: 85%;
  right: 40px;
`;

