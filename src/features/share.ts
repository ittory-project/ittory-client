import { SessionLogger, getHostUrl, isMobileDevice } from '../utils';

const logger = new SessionLogger('share');

/**
 * 클립보드 복사 fallback 함수
 */
export const fallbackCopyTextToClipboard = (
  text: string,
  onSuccess?: () => void,
  onError?: () => void,
) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.top = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      onSuccess?.();
    } else {
      alert('텍스트 복사에 실패했습니다.');
      onError?.();
    }
  } catch (error) {
    logger.error('텍스트 복사 실패', error);
    alert('텍스트 복사에 실패했습니다.');
    onError?.();
  } finally {
    document.body.removeChild(textArea);
  }
};

/**
 * 공유 기능 공통 함수
 */
export const shareContent = async ({
  text,
  url,
  onCopySuccess,
  onError,
}: {
  text: string;
  url: string;
  onCopySuccess?: () => void;
  onError?: () => void;
}) => {
  if (!isMobileDevice()) {
    // 데스크톱에서는 클립보드 복사
    const shareTextPc = `${text}\n${url}`;

    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      try {
        await navigator.clipboard.writeText(shareTextPc);
        onCopySuccess?.();
      } catch (error) {
        logger.error('공유 실패: ', error);
        fallbackCopyTextToClipboard(shareTextPc, onCopySuccess, onError);
      }
    } else {
      // Safari 호환용 대체 복사 방식
      fallbackCopyTextToClipboard(shareTextPc, onCopySuccess, onError);
    }
  } else {
    // 모바일에서는 네이티브 공유
    try {
      await navigator.share({
        text,
        url,
      });
      logger.debug('공유 성공');
    } catch (e) {
      logger.error('공유 실패', e);
      onError?.();
    }
  }
};

/**
 * 편지 공유용 함수 (받기 페이지)
 */
export const shareReceiveLetter = async ({
  letterId,
  receiverName,
  title,
  participantNames,
  onCopySuccess,
  onError,
}: {
  letterId: number;
  receiverName: string;
  title: string;
  participantNames: string[];
  onCopySuccess?: () => void;
  onError?: () => void;
}) => {
  const encodedReceiverName = encodeURIComponent(receiverName);
  const shareText = `To. ${receiverName}\n${title}\nFrom. ${participantNames.join(', ')}`;
  const url = `${getHostUrl()}/receive/${letterId}?to=${encodedReceiverName}`;

  await shareContent({
    text: shareText,
    url,
    onCopySuccess,
    onError,
  });
};

/**
 * 편지 초대용 공유 함수
 */
export const shareInviteLetter = async ({
  letterId,
  inviterName,
  title,
  onCopySuccess,
  onError,
}: {
  letterId: number;
  inviterName: string;
  title: string;
  onCopySuccess?: () => void;
  onError?: () => void;
}) => {
  const shareText = `${inviterName}님이 "${title}" 편지에 초대했습니다!`;
  const url = `${getHostUrl()}/join/${letterId}`;

  await shareContent({
    text: shareText,
    url,
    onCopySuccess,
    onError,
  });
};
