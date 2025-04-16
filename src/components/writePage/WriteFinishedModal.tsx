import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { decodeLetterId } from '../../api/config/base64';
import styled from 'styled-components';
import { postPartiLetterBox } from '../../api/service/LetterBoxService';

interface FinishModalProps {
  isFirstUser: boolean;
}

export const WriteFinishedModal = ({ isFirstUser }: FinishModalProps) => {
  const { letterId } = useParams();
  const [letterNumId] = useState(decodeLetterId(String(letterId)));

  const storeNowLetter = async () => {
    const response: boolean = await postPartiLetterBox(letterNumId);
    if (response) {
      console.log('저장 성공');
    } else {
      console.log('저장 실패');
    }
  };
  useEffect(() => {
    console.log('저장할 유저인가?: ', isFirstUser);
    if (isFirstUser) {
      storeNowLetter();
    }
  }, []);

  return (
    <Overlay>
      <Popup>
        <PopupTitle>{`편지 작성이 끝났어요!`}</PopupTitle>
        <PopupTitleDetail>{`잠시만 기다려 주세요`}</PopupTitleDetail>
        <PopupMessage>
          <MessageImg src="/img/write_letter_order.png" />
          {`편지 생성 중 ...`}
        </PopupMessage>
        <Character src="/img/letter_complete_character.gif" />
      </Popup>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
`;

const Popup = styled.div`
  display: flex;
  width: 80%;
  padding: 32px 15px 24px 15px;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  border-radius: var(--Border-Radius-radius_500, 16px);
  border: 3px solid var(--Color-secondary-soft_blue, #d3edff);
  background: linear-gradient(0deg, #fdfdfd 62.65%, #caf2fe 98.8%);
  box-shadow:
    0px 4px 0px 0px rgba(195, 241, 255, 0.8) inset,
    0px -4px 0px 0px rgba(0, 0, 0, 0.1) inset;
`;

const PopupTitle = styled.div`
  align-self: stretch;
  color: var(--Color-grayscale-gray900, #212529);
  text-align: center;
  /* title/medium_bold */
  font-family: var(--Typography-family-title, SUIT);
  font-size: var(--Typography-size-m, 18px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-s, 24px); /* 133.333% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const PopupTitleDetail = styled.div`
  color: var(--Color-grayscale-gray600, #868e96);
  text-align: center;
  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 500;
  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const PopupMessage = styled.div`
  color: var(--Color-secondary-blue, #4db4ff);
  text-align: center;

  /* caption/xsmall_medium */
  font-family: var(--Typography-family-caption, SUIT);
  font-size: var(--Typography-size-xs, 12px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-2xs, 16px); /* 133.333% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);

  border-radius: var(--Border-Radius-radius_500, 16px);
  border: 3px solid var(--Color-secondary-soft_blue, #d3edff);
  background: linear-gradient(0deg, #fdfdfd 62.65%, #caf2fe 98.8%);
  color: #4db4ff;

  border-radius: 100px;
  border: 1px solid var(--Color-grayscale-gray200, #e9ecef);
  background: #fff;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);

  display: flex;
  padding: 4px 12px;
  justify-content: center;
  align-items: center;
  gap: 6px;

  /* caption/xsmall_medium */
  font-family: var(--Typography-family-caption, SUIT);
  font-size: var(--Typography-size-xs, 12px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-2xs, 16px);
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const MessageImg = styled.img`
  width: 22px;
  height: var(--Typography-size-s, 16px);
  flex-shrink: 0;
  margin: 5px 0px 5px 0px;
`;

const Character = styled.img`
  display: flex;
  width: 272px;
  padding: 32px 24px 24px 24px;
  flex-direction: column;
  align-items: center;
`;
