import styled from "styled-components";
import { LetterPartiItem } from "../../api/model/LetterModel";

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
            {writeOrderList.length > 1 &&
              <Line $itemnum={Number(writeOrderList.length)} />
            }
            {writeOrderList
              .slice()
              .sort((a, b) => a.sequence - b.sequence)
              .map((participant) => (
                <ListItem key={participant.sequence}>
                  {writeOrderList.length > 1 &&
                    <ListNumber>{participant.sequence}</ListNumber>
                  }
                  <Avatar
                    src={participant.imageUrl || "/assets/basic_user.svg"}
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
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  z-index: 3;
`;

const Popup = styled.div`
  width: 180px;
  max-height: 50vh;
  display: flex;
  padding: 8px 12px 16px 12px;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: absolute;
  right: 16px;
  top: 72px;
  border-radius: var(--Border-Radius-radius_400, 12px);
  border: 2px solid var(--Color-secondary-soft_blue, #d3edff);
  background: var(--color-black-white-white, #fff);
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const PopupList = styled.ul`
  z-index: 2;
  position: relative;
  width: 100%;
  list-style-type: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0px 20px 15px 0px;
  z-index: 2;
`;

const ListNumber = styled.div`
  width: var(--Typography-size-m, 18px);
  height: var(--Typography-size-m, 18px);
  padding: 4px var(--Border-Radius-radius_100, 4px);
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: var(--color-black-white-white, #fff);
  text-align: center;
  font-family: var(--Typography-family-number, "Gmarket Sans");
  font-size: 12px;
  font-style: bold;
  line-height: var(--Typography-line_height-2xs, 16px); /* 160% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
  border-radius: var(--Border-Radius-radius_circle, 50px);
  background: var(--Color-secondary-blue, #d3edff);
  color: var(--color-black-white-white, #4db4ff);
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 15px 0 15px;
`;

const Name = styled.span`
  font-size: 16px;
  color: #333;
`;

const Line = styled.div<{ $itemnum: number }>`
  border-left: 1.5px dashed #d3edff;
  height: ${({ $itemnum }) => `calc(${$itemnum} * 55px - 28px)`};
  top: 7px;
  left: 12px;
  position: absolute;
  z-index: 1;
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
