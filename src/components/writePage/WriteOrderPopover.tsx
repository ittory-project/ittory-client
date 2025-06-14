import styled from 'styled-components';

import defaultImg from '@/assets/menu/logindefault.png';
import popoverClose from '@/assets/popover_close.svg';

import { LetterPartiItem } from '../../api/model/LetterModel';

interface PopoverProps {
  writeOrderList: LetterPartiItem[];
  onClose: () => void;
}

export const WriteOrderPopover = ({
  writeOrderList,
  onClose,
}: PopoverProps) => {
  return (
    // 상단에 순서 버튼 누르면 작게 순서 알려주는거
    <Overlay onClick={onClose}>
      <Popup onClick={(e) => e.stopPropagation()}>
        <ButtonContainer>
          <img src={popoverClose} onClick={onClose} />
        </ButtonContainer>
        {writeOrderList ? (
          <PopupList>
            {writeOrderList.length > 1 && (
              <Line $itemnum={Number(writeOrderList.length)} />
            )}
            {writeOrderList
              .slice()
              .sort((a, b) => a.sequence - b.sequence)
              .map((participant) => (
                <ListItem key={participant.sequence}>
                  {writeOrderList.length > 1 && (
                    <ListNumber>{participant.sequence}</ListNumber>
                  )}
                  <Avatar
                    src={participant.imageUrl || defaultImg}
                    alt={participant.nickname}
                  />
                  <Name>{participant.nickname}</Name>
                </ListItem>
              ))}
          </PopupList>
        ) : (
          <PopupTitleDetail>유저가 존재하지 않습니다.</PopupTitleDetail>
        )}
      </Popup>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;

  display: flex;

  width: 100%;
  height: 100%;

  background-color: rgba(0, 0, 0, 0);
`;

const Popup = styled.div`
  position: absolute;
  top: 72px;
  right: 16px;

  display: flex;

  flex-direction: column;

  gap: 8px;
  align-items: center;

  width: 180px;

  padding: 8px 12px 16px 12px;

  background: var(--color-black-white-white, #fff);
  border: 2px solid var(--Color-secondary-soft_blue, #d3edff);
  border-radius: var(--Border-Radius-radius_400, 12px);
`;

const ButtonContainer = styled.div`
  display: flex;

  justify-content: flex-end;

  width: 100%;
`;

const PopupList = styled.ul`
  position: relative;
  z-index: 2;

  width: 100%;

  padding: 0;
  margin: 0;

  list-style-type: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ListItem = styled.li`
  z-index: 2;

  display: flex;

  align-items: center;

  padding-bottom: 15px;
`;

const ListNumber = styled.div`
  /* FIXME: z-index 정책 만들기 */
  z-index: 2;

  box-sizing: border-box;
  display: flex;

  align-items: center;
  justify-content: center;

  width: 18px;
  height: 18px;

  padding: 4px;
  margin-left: 4px;

  font-family: var(--Typography-family-number, 'GmarketSans');
  font-size: 8px;
  font-style: normal;
  font-weight: 400;

  line-height: normal;

  color: var(--color-black-white-white, #4db4ff);

  text-align: center;
  letter-spacing: -0.4px;

  background: var(--Color-secondary-blue, #d3edff);
  border-radius: var(--Border-Radius-radius_circle, 50px);
`;

const Avatar = styled.img`
  width: 24px;
  height: 24px;

  margin: 0 15px 0 15px;

  border-radius: 50%;
`;

const Name = styled.span`
  flex: 1;

  overflow: hidden;
  text-overflow: ellipsis;

  font-family: SUIT;
  font-size: 12px;

  color: #333;

  white-space: nowrap;
`;

const Line = styled.div<{ $itemnum: number }>`
  position: absolute;
  top: 8px;
  left: 12px;
  z-index: 1;

  /* NOTE: 30px이 2인~5인 간격에 적절히 표시됨 */
  height: ${({ $itemnum }) => `calc(${$itemnum} * 30px)`};

  border-left: 1.5px dashed #d3edff;
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
