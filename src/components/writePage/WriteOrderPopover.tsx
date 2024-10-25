import styled from "styled-components";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LetterPartiItem, LetterPartiListGetResponse } from "../../api/model/LetterModel";
import { getLetterPartiList } from "../../api/service/LetterService";
import { decodeLetterId } from "../../api/config/base64";

interface PopoverProps {
  onClose: () => void;
}

export const WriteOrderPopover: React.FC<PopoverProps> = ({ onClose }) => {
  const { letterId } = useParams()
  const [letterNumId] = useState(decodeLetterId(String(letterId)));
  const [writeOrderList, setWriteOrderList] = useState<LetterPartiItem[]>()

  const getPartiList = async () => {
    if (!letterId) {
      window.alert("잘못된 접근입니다.")
    } else if (!letterNumId) {
      window.alert("잘못된 접근입니다.")
    } else {
      const response: LetterPartiListGetResponse = await getLetterPartiList(letterNumId);
      setWriteOrderList(response.participants)
    }
  }

  useEffect(() => {
    getPartiList()
  }, []);

  return (
    // 상단에 순서 버튼 누르면 작게 순서 알려주는거
    <Overlay onClick={onClose}>
      <Popup onClick={(e) => e.stopPropagation()}>
        <ButtonContainer>
          <img src="/assets/popover_close.svg" onClick={onClose}/>
        </ButtonContainer>
        {writeOrderList ?
          <PopupList>
            <Line $itemnum={Number(writeOrderList.length)} />
            {writeOrderList.map(participant => (
              <ListItem key={participant.sequence}>
                <ListNumber>{participant.sequence}</ListNumber>
                <Avatar src={participant.imageUrl || '/assets/basic_user.svg'} alt={participant.nickname} />
                <Name>{participant.nickname}</Name>
              </ListItem>
            ))}
          </PopupList>
            : <PopupTitleDetail>유저가 존재하지 않습니다.</PopupTitleDetail>
          }
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
  border: 2px solid var(--Color-secondary-soft_blue, #D3EDFF);
  background: var(--color-black-white-white, #FFF);
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
  color: var(--color-black-white-white, #FFF);
  text-align: center;
  font-family: var(--Typography-family-number, "Gmarket Sans");
  font-size: 12px;
  font-style: bold;
  line-height: var(--Typography-line_height-2xs, 16px); /* 160% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
  border-radius: var(--Border-Radius-radius_circle, 50px);
  background: var(--Color-secondary-blue, #D3EDFF);
  color: var(--color-black-white-white, #4DB4FF);
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
  border-left: 1.5px dashed #D3EDFF;
  height: ${({ $itemnum }) => `calc(${$itemnum} * 55px)`};
  top: 0px;
  left: 12px;
  position: absolute;
  z-index: 1;
`;

const PopupTitleDetail = styled.div`
  color: var(--Color-grayscale-gray600, #868E96);
  text-align: center;
  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 500;
  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;