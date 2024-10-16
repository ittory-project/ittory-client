import { useEffect, useState } from "react";
import styled from "styled-components";

import { LetterPartiItem, LetterPartiListGetResponse, LetterStartInfoGetResponse } from "../../../api/model/LetterModel";
import { getLetterPartiList, getLetterStartInfo } from "../../../api/service/LetterService";
import { useParams } from "react-router-dom";

interface WriteModalProps {
  onClose: () => void;
}

export const WriteMainModal: React.FC<WriteModalProps> = ({ onClose }) => {
  const { letterId } = useParams()
  const [partiCount, setPartiCount] = useState<Number | null>()
  const [repeatCount, setRepeatCount] = useState<Number | null>()
  const [elementCount, setElementCount] = useState<Number | null>()
  const [writeOrderList, setWriteOrderList] = useState<LetterPartiItem[]>()

  const getStartInfo = async () => {
    if (!letterId) {
      window.alert("잘못된 접근입니다.")
    } else {
      const response: LetterStartInfoGetResponse = await getLetterStartInfo(Number(letterId));
      setPartiCount(response.participantCount)
      setRepeatCount(response.repeatCount)
      setElementCount(response.elementCount)
    }
  }

  const getPartiList = async () => {
    if (!letterId) {
      window.alert("잘못된 접근입니다.")
    } else {
      const response: LetterPartiListGetResponse = await getLetterPartiList(Number(letterId));
      setWriteOrderList(response.participants)
    }
  }

  useEffect(() => {
    getStartInfo()
    getPartiList()
  }, []);

  return (
    <Overlay onClick={onClose}>
      <Popup onClick={(e) => e.stopPropagation()}>
        <PopupTitle>
          {String(partiCount)}명의 참여자가
          <br/>
          {String(repeatCount)}번씩 이어 쓸 거예요!
        </PopupTitle>
        <PopupTitleDetail>
          총 {String(elementCount)}개의 그림이 생성돼요
        </PopupTitleDetail>
        <PopupList>
          <PopupListTitle>
            작성 순서
          </PopupListTitle>
          {writeOrderList &&
            <List>
              <Line $itemnum={Number(partiCount)} />
              {writeOrderList.map(participant => (
                <ListItem key={participant.sequence}>
                  <ListNumber>{participant.sequence}</ListNumber>
                  <Avatar src={participant.imageUrl} alt={participant.nickname} />
                  <Name>{participant.nickname}</Name>
                </ListItem>
              ))}
            </List>
          }
        </PopupList>
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
  background: linear-gradient(144deg, #FFF -0.87%, #C3F1FF 109.18%);
  box-shadow: 0px 4px 0px 0px rgba(195, 241, 255, 0.80) inset, 0px -4px 0px 0px rgba(0, 0, 0, 0.10) inset;
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
  color: var(--Color-grayscale-gray600, #868E96);
  text-align: center;
  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 500;
  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const PopupList = styled.div`
  display: flex;
  max-height: 50vh;
  width: 224px;
  padding: 0px var(--Typography-line_height-l, 40px) 16px var(--Typography-line_height-l, 40px);
  flex-direction: column;
  align-items: center;
  gap: 16px;
  border-radius: var(--Border-Radius-radius_400, 12px);
  border: 3px solid var(--Color-secondary-soft_blue, #D3EDFF);
  background: var(--color-black-white-white, #FFF);
`;

const PopupListTitle = styled.div`
  display: flex;
  width: 106px;
  padding: var(--Border-Radius-radius_100, 4px) 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 0px 0px 12px 12px;
  background: var(--Color-secondary-soft_blue, #D3EDFF);
  box-shadow: 0px -2px 0px 0px rgba(0, 0, 0, 0.04) inset;
  color: var(--Color-secondary-blue, #4DB4FF);
  text-align: center;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: var(--Typography-size-xs, 12px);
  font-style: normal;
  font-weight: 500;
  line-height: var(--Typography-line_height-2xs, 16px); /* 133.333% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const List = styled.ul`
  z-index: 2;
  position: relative;
  width: 100%;
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
  padding: 10px 20px 10px 0px;
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
  background: var(--Color-secondary-blue, #4DB4FF);
  color: var(--color-black-white-white, #FFF);
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 20px 0 30px;
`;

const Name = styled.span`
  font-size: 16px;
  color: #333;
`;

const Line = styled.div<{ $itemnum: number }>`
  border-left: 1.5px dashed rgba(111, 176, 255, 0.50);
  height: ${({ $itemnum }) => `calc(${$itemnum} * 60px)`};
  top: 0px;
  left: 12px;
  position: absolute;
  z-index: 1;
`;