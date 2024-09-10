import styled from 'styled-components';

export const ReceiveLetterSave = () => {
  return (
    <>
      <ProductLeftSide src='/img/cover/left.svg' />
      <ProductRightSide src='/img/cover/product.svg' />
      <Content>받은 편지를<br/>간직하고 싶다면?</Content>
      <ContentImg src='/img/letter_save_contents.png'/>
      <ContentSaveBtn>편지함에 보관하기</ContentSaveBtn>
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
  width: 122px;
  height: 122px;
  border-radius: 100px;
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-47%, -0%);
`;

const Content = styled.div`
  color: #343A40;
  text-align: center;
  width: 150px;

  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
  
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translate(-47%, -0%);
`;

const ContentSaveBtn = styled.div`
  display: flex;
  width: 130px;
  height: 20px;
  padding: 12px;
  justify-content: center;
  align-items: center;
  gap: 8px;

  color: #FFF;
  border-radius: 50px;
  background: #343A40;
  box-shadow: -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset, 1px 1px 0.4px 0px rgba(255, 255, 255, 0.30) inset;

  font-family: var(--Typography-family-body, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; 
  letter-spacing: -0.5px;

  position: absolute;
  top: 75%;
  left: 50%;
  transform: translateX(-50%);
`;

