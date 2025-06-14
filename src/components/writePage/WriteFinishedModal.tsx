import styled from 'styled-components';

import letterCompleteCharacter from '@/assets/letter_complete_character.gif';
import writeLetterOrder from '@/assets/write_letter_order.png';

export const WriteFinishedModal = () => {
  return (
    <Overlay>
      <Popup>
        <PopupTitle>{`편지 작성이 끝났어요!`}</PopupTitle>
        <PopupTitleDetail>{`잠시만 기다려 주세요`}</PopupTitleDetail>
        <PopupMessage>
          <MessageImg src={writeLetterOrder} />
          {`편지 생성 중 ...`}
        </PopupMessage>
        <Character src={letterCompleteCharacter} />
      </Popup>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  background-color: rgba(0, 0, 0, 0.5);
`;

const Popup = styled.div`
  display: flex;

  flex-direction: column;

  gap: 16px;
  align-items: center;

  width: 80%;

  padding: 32px 15px 24px 15px;

  background: linear-gradient(0deg, #fdfdfd 62.65%, #caf2fe 98.8%);
  border: 3px solid var(--Color-secondary-soft_blue, #d3edff);
  border-radius: var(--Border-Radius-radius_500, 16px);
  box-shadow:
    0px 4px 0px 0px rgba(195, 241, 255, 0.8) inset,
    0px -4px 0px 0px rgba(0, 0, 0, 0.1) inset;
`;

const PopupTitle = styled.div`
  align-self: stretch;
  /* title/medium_bold */
  font-family: var(--Typography-family-title, SUIT);
  font-size: var(--Typography-size-m, 18px);
  font-style: normal;
  font-weight: 700;

  line-height: var(--Typography-line_height-s, 24px); /* 133.333% */

  color: var(--Color-grayscale-gray900, #212529);

  text-align: center;
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const PopupTitleDetail = styled.div`
  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 500;

  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */

  color: var(--Color-grayscale-gray600, #868e96);

  text-align: center;
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const PopupMessage = styled.div`
  display: flex;

  gap: 6px;
  align-items: center;
  justify-content: center;

  padding: 4px 12px;

  /* caption/xsmall_medium */
  font-family: var(--Typography-family-caption, SUIT);

  /* caption/xsmall_medium */
  font-family: var(--Typography-family-caption, SUIT);
  font-size: var(--Typography-size-xs, 12px);
  font-size: var(--Typography-size-xs, 12px);
  font-style: normal;
  font-style: normal;
  font-weight: 700;
  font-weight: 700;

  line-height: var(--Typography-line_height-2xs, 16px); /* 133.333% */
  line-height: var(--Typography-line_height-2xs, 16px);

  color: var(--Color-secondary-blue, #4db4ff);
  color: #4db4ff;

  text-align: center;
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);

  background: linear-gradient(0deg, #fdfdfd 62.65%, #caf2fe 98.8%);
  background: #fff;
  border: 3px solid var(--Color-secondary-soft_blue, #d3edff);
  border: 1px solid var(--Color-grayscale-gray200, #e9ecef);
  border-radius: var(--Border-Radius-radius_500, 16px);
  border-radius: 100px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
`;

const MessageImg = styled.img`
  flex-shrink: 0;

  width: 22px;
  height: var(--Typography-size-s, 16px);

  margin: 5px 0px 5px 0px;
`;

const Character = styled.img`
  display: flex;

  flex-direction: column;

  align-items: center;

  width: 272px;

  padding: 32px 24px 24px 24px;
`;
