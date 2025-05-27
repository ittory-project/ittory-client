import styled from 'styled-components';

import coverLeft from '@/assets/cover/left.png';
import coverProductNoBackground from '@/assets/cover/product_no_background.svg';
import letterSaveContents from '@/assets/letter_save_contents.svg';

interface LetterContentProps {
  handleSaveLetter: () => Promise<void>;
}

export const ReceiveLetterSave = ({ handleSaveLetter }: LetterContentProps) => {
  return (
    <>
      <ProductLeftSide src={coverLeft} />
      <ProductRightSide src={coverProductNoBackground} />
      <Content>
        받은 편지를
        <br />
        간직하고 싶다면?
      </Content>
      <ContentImg src={letterSaveContents} />
      <ContentSaveBtn onClick={handleSaveLetter}>
        편지함에 보관하기
      </ContentSaveBtn>
    </>
  );
};

const ProductRightSide = styled.img`
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  margin: 3.5px 4px 3.5px auto;
`;

const ProductLeftSide = styled.img`
  position: absolute;
  top: -7px;
  left: -79px;

  width: 94px;
  height: 369px;

  object-fit: fill;
`;

const ContentImg = styled.img`
  position: absolute;
  top: 35%;
  left: 50%;

  width: 122px;
  height: 122px;

  border-radius: 100px;

  transform: translate(-47%, -0%);
`;

const Content = styled.div`
  position: absolute;
  top: 15%;
  left: 50%;

  width: 150px;

  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #343a40;

  text-align: center;
  letter-spacing: -0.5px;

  transform: translate(-47%, -0%);
`;

const ContentSaveBtn = styled.div`
  position: absolute;
  top: 75%;
  left: 50%;

  display: flex;

  gap: 8px;
  align-items: center;
  justify-content: center;

  width: 130px;
  height: 20px;

  padding: 12px;

  font-family: var(--Typography-family-body, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;

  line-height: 20px;

  color: #fff;

  letter-spacing: -0.5px;

  cursor: pointer;

  background: #343a40;
  border-radius: 50px;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;

  transform: translateX(-50%);
`;
