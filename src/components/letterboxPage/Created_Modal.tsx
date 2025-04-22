import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import X from '../../../public/assets/x.svg';
import delete2 from '../../../public/assets/delete2.svg';
import share from '../../../public/assets/share.svg';
import { LetterDetailGetResponse } from '../../api/model/LetterModel';
import { getLetterDetailInfo } from '../../api/service/LetterService';
import { encodeLetterId } from '../../api/config/base64';
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
  const [letterInfo, setLetterInfo] = useState<LetterDetailGetResponse>();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [encodeId, setEncodeId] = useState<string>('');

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePopup = () => {
    setIsModalOpen(false);
    setPopup(true);
  };

  useEffect(() => {
    const getSharedLetter = async () => {
      const response = await getLetterDetailInfo(Number(letterId));
      setLetterInfo(response);
      setEncodeId(encodeLetterId(letterId));
    };
    getSharedLetter();
  }, [letterId]);

  // 현재 화면 크기 기준 (430px가 트리거) 모바일 화면인지, 데스크톱 화면인지 구분
  const handleResize = () => {
    window.innerWidth < 850 ? setIsMobile(true) : setIsMobile(false);
  };
  useEffect(() => {
    window.innerWidth < 850 ? setIsMobile(true) : setIsMobile(false);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; // 화면에서 보이지 않도록 고정
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000); // 3초 후에 알림 숨기기
      } else {
        alert('텍스트 복사에 실패했습니다.');
      }
    } catch (error) {
      alert('텍스트 복사에 실패했습니다.');
      throw error;
    } finally {
      document.body.removeChild(textArea);
    }
  };

  // 모바일, 데스크톱 화면 구분해서 공유하게 함
  const handleShare = async () => {
    const letterId = encodeId;
    if (letterInfo) {
      const shareText = `To. ${letterInfo.receiverName}\n${letterInfo.title}\nFrom. ${letterInfo.participantNames
        .map((element) => element)
        .join(', ')}`;
      if (!isMobile) {
        const shareTextPc = `${import.meta.env.VITE_FRONT_URL}/receive/${letterId}?to=${letterInfo.receiverName}`;
        if (
          navigator.clipboard &&
          typeof navigator.clipboard.writeText === 'function'
        ) {
          try {
            await navigator.clipboard.writeText(shareTextPc);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
          } catch (error) {
            console.error('공유 실패: ', error);
            fallbackCopyTextToClipboard(shareTextPc);
          }
        } else {
          // Safari 호환용 대체 복사 방식
          fallbackCopyTextToClipboard(shareTextPc);
        }
      } else {
        // 모바일이면
        try {
          await navigator.share({
            text: shareText,
            url: `${import.meta.env.VITE_FRONT_URL}/receive/${letterId}?to=${letterInfo.receiverName}`,
          });
          logger.debug('공유 성공');
        } catch (e) {
          logger.debug('공유 실패', e);
        }
      }
    } else {
      logger.debug('공유 실패');
    }
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
  display: flex;
  padding: var(--Border-Radius-radius_300, 8px) 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  z-index: 100;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  text-align: center;
  font-family: SUIT;
  font-weight: 500;
  font-size: 12px;
  font-style: normal;
  line-height: 16px;
  letter-spacing: -0.5px;
  position: absolute;
  left: 50%;
  bottom: 32px;
  transform: translateX(-50%);
`;

const ModalContainer = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  border-radius: 20px 20px 0px 0px;
  background: #fff;
  z-index: 100;
  flex-direction: column;
  align-items: center;
`;
const Header = styled.div`
  display: flex;
  height: 44px;
  padding: 24px 20px 0 0;
  flex-direction: column;
  align-items: flex-end;
  align-self: stretch;
  box-sizing: border-box;
`;
const Cancel = styled.img`
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  cursor: pointer;
`;
const Contents = styled.div`
  display: flex;
  padding: 0px 20px 24px 16px;
  flex-direction: column;
  align-items: flex-end;
  align-self: stretch;
`;
const List = styled.div`
  display: flex;
  padding: 12px 0px;
  align-items: center;
  gap: 8px;
  align-self: stretch;
`;
const ShareIcon = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-left: 4px;
  margin-right: 4px;
  cursor: pointer;
`;
const DeleteIcon = styled.img`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  cursor: pointer;
`;
const Txt = styled.div`
  color: #212529;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  line-height: 24px;
  letter-spacing: -0.5px;
  cursor: pointer;
`;
