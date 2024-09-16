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
  border-radius: 12px;
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
  color: #212529;
  text-align: center;

  font-family: var(--Typography-family-body, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.5px;
  
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-47%, -0%);
`;

const ContentWriter = styled.div`
  font-size: 16px;
  color: #333;
  line-height: 1.6;

  color: #868E96;
  text-align: right;

  font-family: var(--Typography-family-caption, SUIT);
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: -0.5px;
  
  position: absolute;
  top: 85%;
  right: 40px;
`;

