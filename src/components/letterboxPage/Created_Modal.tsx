import React, { useState } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import delete2 from '@/assets/delete2.svg';
import share from '@/assets/share.svg';
import X from '@/assets/x.svg';

import { letterQuery } from '../../api/queries';
import { shareReceiveLetter } from '../../features/share';
import { SessionLogger } from '../../utils';

const logger = new SessionLogger('letterbox');

interface Props {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
  openLetter: boolean;
  letterId: number;
}

export const Created_Modal = ({
  setIsModalOpen,
  setPopup,
  letterId,
}: Props) => {
  const { data: letterInfo } = useSuspenseQuery(
    letterQuery.detailById(letterId),
  );

  const [copied, setCopied] = useState<boolean>(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePopup = () => {
    setIsModalOpen(false);
    setPopup(true);
  };

  // 모바일, 데스크톱 화면 구분해서 공유하게 함
  const handleShare = async () => {
    await shareReceiveLetter({
      letterId: letterInfo.letterId,
      receiverName: letterInfo.receiverName,
      title: letterInfo.title,
      participantNames: letterInfo.participantNames,
      onCopySuccess: () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      },
      onError: () => {
        logger.debug('공유 실패');
      },
    });
  };
  return (
    <>
      <ModalContainer>
        <Header>
          <Cancel src={X} alt="cancel" onClick={closeModal} />
        </Header>
        <Contents>
          <List onClick={handleShare}>
            <ShareIcon src={share} alt="share" />
            <Txt>공유하기</Txt>
          </List>
          <List onClick={handlePopup}>
            <DeleteIcon src={delete2} alt="delete" />
            <Txt>삭제하기</Txt>
          </List>
        </Contents>
      </ModalContainer>
      {copied && <CopyAlert>링크를 복사했어요</CopyAlert>}
    </>
  );
};

const CopyAlert = styled.div`
  position: absolute;
  bottom: 32px;
  left: 50%;
  z-index: 100;

  display: flex;

  gap: 10px;
  align-items: center;
  justify-content: center;

  padding: var(--Border-Radius-radius_300, 8px) 20px;

  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;

  line-height: 16px;

  color: #fff;

  text-align: center;
  letter-spacing: -0.5px;

  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;

  transform: translateX(-50%);
`;

const ModalContainer = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 100;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 100%;

  background: #fff;
  border-radius: 20px 20px 0px 0px;
`;
const Header = styled.div`
  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  align-items: flex-end;
  align-self: stretch;

  height: 44px;

  padding: 24px 20px 0 0;
`;
const Cancel = styled.img`
  flex-shrink: 0;

  width: 12px;
  height: 12px;

  cursor: pointer;
`;
const Contents = styled.div`
  display: flex;

  flex-direction: column;

  align-items: flex-end;
  align-self: stretch;

  padding: 0px 20px 24px 16px;
`;
const List = styled.div`
  display: flex;

  gap: 8px;
  align-items: center;
  align-self: stretch;

  padding: 12px 0px;
`;
const ShareIcon = styled.img`
  flex-shrink: 0;

  width: 16px;
  height: 16px;

  margin-right: 4px;
  margin-left: 4px;

  cursor: pointer;
`;
const DeleteIcon = styled.img`
  flex-shrink: 0;

  width: 24px;
  height: 24px;

  cursor: pointer;
`;
const Txt = styled.div`
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;

  line-height: 24px;

  color: #212529;

  letter-spacing: -0.5px;

  cursor: pointer;
`;
