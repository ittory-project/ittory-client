import styled from 'styled-components';
import { LetterDetail } from '../../api/model/LetterModel';
import { FontGetResponse } from '../../api/model/FontModel';

interface LetterContentProps {
  letterFontStyle: FontGetResponse;
  letterContent: LetterDetail;
}

export const ReceiveLetterContents = ({
  letterFontStyle,
  letterContent,
}: LetterContentProps) => {
  return (
    <>
      <ProductLeftSide src="/img/cover/left.png" />
      <ProductRightSide src="/img/cover/product.svg" />
      <ContentImg src={letterContent.coverImageUrl} />
      <Content $fonttype={letterFontStyle.name}>
        {letterContent.content}
      </Content>
      <ContentWriter $fonttype={letterFontStyle.name}>
        {letterContent.nickname}
      </ContentWriter>
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
  width: 95px;
  height: 369px;
  object-fit: fill;
  position: absolute;
  left: -79px;
  top: -7px;
`;

const ContentImg = styled.img`
  width: 182px;
  height: 182px;
  border-radius: 12px;
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translate(-47%, -0%);
`;

const Content = styled.div<{ $fonttype: string }>`
  display: flex;
  height: 41px;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  color: #212529;
  text-align: center;

  font-family: ${(props) => props.$fonttype};
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

const ContentWriter = styled.div<{ $fonttype: string }>`
  font-size: 16px;
  color: #333;
  line-height: 1.6;

  color: #868e96;
  text-align: right;

  font-family: ${(props) => props.$fonttype};
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: -0.5px;

  position: absolute;
  top: 85%;
  right: 40px;
`;
