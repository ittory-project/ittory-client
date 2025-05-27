import { useEffect, useState } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import btnClose from '@/assets/btn_close_white.svg';

import { AppDispatch, clearData, clearOrderData } from '../../api/config/state';
import { coverQuery, fontQuery, letterQuery } from '../../api/queries';
import { SessionLogger, getHostUrl, isMobileDevice } from '../../utils';
import { Pagination } from '../common/Pagination';
import { ReceiveLetterContents } from '../receivePage/ReceiveLetterContents';
import { ReceiveLetterCover } from '../receivePage/ReceiveLetterCover';

const logger = new SessionLogger('share');

function Query() {
  return new URLSearchParams(useLocation().search);
}

export const ShareLetter = () => {
  const { letterId } = useParams();
  const letterNumId = Number(letterId);

  const { data: letterInfo } = useSuspenseQuery(
    letterQuery.detailById(letterNumId),
  );
  const { data: font } = useSuspenseQuery(fontQuery.byId(letterInfo.fontId));
  const { data: coverTypes } = useSuspenseQuery(coverQuery.all());
  const coverType = coverTypes.find(
    (type) => type.id === letterInfo.coverTypeId,
  );
  if (!coverType) {
    throw new Error('커버 타입을 찾을 수 없습니다.');
  }

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [copied, setCopied] = useState<boolean>(false);

  const query = Query();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const page = Number(query.get('page')) || 1;
    setCurrentPage(page);
  }, [query]);

  useEffect(() => {
    dispatch(clearOrderData());
    dispatch(clearData());
    window.localStorage.setItem('nowLetterId', '1');
    window.localStorage.setItem('nowSequence', '1');
    window.localStorage.setItem('nowRepeat', '1');
    window.localStorage.setItem('totalItem', '1');
    window.localStorage.setItem('resetTime', '');
  }, []);

  const renderPageContent = () => {
    if (!letterInfo || !coverType || !font) {
      return <div>편지를 찾을 수 없습니다.</div>;
    } else {
      if (currentPage === 1)
        return (
          <ReceiveLetterCover
            letterStyle={coverType}
            letterFontStyle={font}
            letterContent={letterInfo}
          />
        );
      else
        return (
          <ReceiveLetterContents
            letterContent={letterInfo.elements[currentPage - 2]}
          />
        );
    }
  };

  const handleStorage = async () => {
    navigate('/letterbox');
  };

  const handleCloseBtn = () => {
    navigate('/');
  };

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
      logger.error('텍스트 복사 실패', error);
      alert('텍스트 복사에 실패했습니다.');
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const createShare = async () => {
    if (letterInfo) {
      const encodedReceiverName = encodeURIComponent(letterInfo.receiverName);

      const shareText = `To. ${letterInfo.receiverName}\n${letterInfo.title}\nFrom. ${letterInfo.participantNames
        .map((element) => element)
        .join(', ')}`;

      if (!isMobileDevice()) {
        const shareTextPc = `${shareText}\n${getHostUrl()}/receive/${letterId}?to=${encodedReceiverName}`;
        if (
          navigator.clipboard &&
          typeof navigator.clipboard.writeText === 'function'
        ) {
          try {
            await navigator.clipboard.writeText(shareTextPc);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
          } catch (error) {
            logger.error('공유 실패: ', error);
            fallbackCopyTextToClipboard(shareTextPc);
          }
        } else {
          // Safari 호환용 대체 복사 방식
          fallbackCopyTextToClipboard(shareTextPc);
        }
      } else {
        try {
          await navigator.share({
            text: shareText,
            url: `${getHostUrl()}/receive/${letterId}?to=${encodedReceiverName}`,
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

  return letterInfo && coverType && font ? (
    <Background $backgroundimg={'' + coverType.outputBackgroundImageUrl}>
      <CloseBtn onClick={handleCloseBtn} src={btnClose} />
      <CoverShadow>
        <CoverContainer $boardimg={'' + coverType.outputBoardImageUrl}>
          {renderPageContent()}
        </CoverContainer>
      </CoverShadow>
      <Pagination totalPages={letterInfo.elements.length + 1} />
      <BtnContainer>
        <StoreBtn onClick={handleStorage}>편지함 이동하기</StoreBtn>
        <ShareBtn onClick={createShare}>지금 전달하기</ShareBtn>
      </BtnContainer>
      {copied && <CopyAlert>링크를 복사했어요</CopyAlert>}
    </Background>
  ) : (
    <div>편지를 불러올 수 없습니다.</div>
  );
};

const Background = styled.div<{ $backgroundimg: string }>`
  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100dvh;

  background-image: url(${(props) => props.$backgroundimg});
  background-size: cover;
`;

const CloseBtn = styled.img`
  position: absolute;
  top: 20px;
  right: 20px;

  width: 24px;
  height: 24px;

  cursor: pointer;
`;

const CoverContainer = styled.div<{ $boardimg: string }>`
  position: relative;

  flex-shrink: 0;

  width: 272px;
  height: 355px;

  background-image: url(${(props) => props.$boardimg});
  border-radius: 5px 15px 15px 5px;
`;

const CoverShadow = styled.div`
  display: flex;

  align-items: center;

  background-size: cover;
  border-radius: 5px 15px 15px 5px;
  box-shadow:
    0 2px 1px rgba(0, 0, 0, 0.09),
    0 4px 2px rgba(0, 0, 0, 0.09),
    0 8px 4px rgba(0, 0, 0, 0.09),
    0 16px 8px rgba(0, 0, 0, 0.09),
    0 32px 16px rgba(0, 0, 0, 0.09);
`;

const BtnContainer = styled.div`
  display: flex;

  gap: 10px;
  align-items: center;
  justify-content: center;

  width: 320px;

  padding: 10px 16px 5px 16px;
`;

const StoreBtn = styled.button`
  display: flex;

  gap: var(--Border-Radius-radius_300, 8px);
  align-items: center;
  justify-content: center;

  width: 140px;
  height: 48px;

  padding: var(--Typography-size-s, 14px) 20px;

  /* body/small_bold */
  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 700;

  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */

  color: var(--Color-grayscale-gray700, #495057);

  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);

  background: var(--color-black-white-white, #fff);
  border-radius: var(--Border-Radius-radius_circle, 50px);
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;

  &:focus {
    outline: none;
  }
`;

const ShareBtn = styled.button`
  display: flex;

  gap: var(--Border-Radius-radius_300, 8px);
  align-items: center;
  justify-content: center;

  width: 140px;
  height: 48px;

  padding: var(--Typography-size-s, 14px) 20px;

  /* body/small_bold */
  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 700;

  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */

  color: var(--color-black-white-white, #fff);

  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);

  background: var(--Color-primary-orange, #ffa256);
  border-radius: var(--Border-Radius-radius_circle, 50px);
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;

  &:focus {
    outline: none;
  }
`;

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
