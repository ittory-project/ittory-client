import styled from 'styled-components';

export const ReceiveLetterContents = () => {
  return (
    <>
      <ProductLeftImage src='/img/cover/left.svg' />
      <ProductImage src='/img/cover/product.svg' />
      <ContentTitle>편지 내용 제목</ContentTitle>
      <ContentText>
      </ContentText>
    </>
  );
};

const ProductImage = styled.img`
  display: flex;
  margin: 3.5px 4px 3.5px auto;
  justify-content: center;
  align-items: center;
`;

const ProductLeftImage = styled.img`
  width: 67px;
  height: 369px;
  object-fit: fill;
  position: absolute;
  left: -51px;
  top: -7px;
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

