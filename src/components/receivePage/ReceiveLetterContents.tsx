import styled from 'styled-components';

import coverLeft from '@/assets/cover/left.png';
import coverProduct from '@/assets/cover/product.svg';

import { LetterDetail } from '../../api/model/LetterModel';

interface LetterContentProps {
  letterContent: LetterDetail;
}

export const ReceiveLetterContents = ({
  letterContent,
}: LetterContentProps) => {
  return (
    <>
      <ProductLeftSide src={coverLeft} />
      <ProductRightSide src={coverProduct} />
      <ContentImg src={letterContent.coverImageUrl} />
      <Content>{letterContent.content}</Content>
      <ContentWriter>{letterContent.nickname}</ContentWriter>
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

  width: 95px;
  height: 369px;

  object-fit: fill;
`;

const ContentImg = styled.img`
  position: absolute;
  top: 40px;
  left: 50%;

  width: 182px;
  height: 182px;

  border-radius: 12px;

  transform: translate(-47%, -0%);
`;

const Content = styled.div`
  position: absolute;
  top: 65%;
  left: 50%;

  display: flex;

  flex-direction: column;

  align-self: stretch;
  justify-content: center;

  height: 41px;

  font-family: var(--Typography-family-title);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;

  line-height: 20px;

  color: #212529;

  text-align: center;
  letter-spacing: -0.5px;

  transform: translate(-47%, -0%);
`;

const ContentWriter = styled.div`
  position: absolute;
  top: 85%;
  right: 40px;

  font-family: var(--Typography-family-title);
  font-size: 16px;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;

  line-height: 1.6;
  line-height: 16px;

  color: #333;
  color: #868e96;

  text-align: right;
  letter-spacing: -0.5px;
`;
