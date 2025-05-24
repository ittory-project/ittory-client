import styled from 'styled-components';

import defaultImg from '../../../public/assets/menu/logindefault.png';
import { LetterPartiItem } from '../../api/model/LetterModel';

interface PopoverProps {
  writeOrderList: LetterPartiItem[];
  onClose: () => void;
}

export const WriteOrderPopover: React.FC<PopoverProps> = ({
  writeOrderList,
  onClose,
}) => {
  return (
    // 상단에 순서 버튼 누르면 작게 순서 알려주는거
    <Overlay onClick={onClose}>
      <Popup onClick={(e) => e.stopPropagation()}>
        <ButtonContainer>
          <img src="/assets/popover_close.svg" onClick={onClose} />
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
  max-height: 50vh;

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

  overflow-y: auto;

  list-style-type: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ListItem = styled.li`
  z-index: 2;

  display: flex;

  align-items: center;

  padding: 0px 20px 15px 0px;
`;

const ListNumber = styled.div`
  gap: 10px;
  align-items: center;
  justify-content: center;

  width: var(--Typography-size-m, 18px);
  height: var(--Typography-size-m, 18px);

  padding: 4px var(--Border-Radius-radius_100, 4px);

  font-family: var(--Typography-family-number, 'Gmarket Sans');
  font-size: 12px;
  font-style: bold;

  line-height: var(--Typography-line_height-2xs, 16px); /* 160% */

  color: var(--color-black-white-white, #fff);
  color: var(--color-black-white-white, #4db4ff);

  text-align: center;
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);

  background: var(--Color-secondary-blue, #d3edff);
  border-radius: var(--Border-Radius-radius_circle, 50px);
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;

  margin: 0 15px 0 15px;

  border-radius: 50%;
`;

const Name = styled.span`
  width: 40px;

  overflow: hidden;
  text-overflow: ellipsis;

  font-family: SUIT;
  font-size: 16px;

  color: #333;

  white-space: nowrap;
`;

const Line = styled.div<{ $itemnum: number }>`
  position: absolute;
  top: 7px;
  left: 12px;
  z-index: 1;

  height: ${({ $itemnum }) => `calc(${$itemnum} * 55px - 28px)`};

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
