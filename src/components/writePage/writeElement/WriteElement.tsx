import { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import { ElementResponse } from '../../../api/model/ElementModel';
import { useTimeLeft } from '../../../hooks';

interface WriteElementProps {
  element: ElementResponse;
  onSubmit: (_content: string) => void;
  onClose: () => void;
}

export const WriteElement = ({
  element,
  onSubmit,
  onClose,
}: WriteElementProps) => {
  const [text, setText] = useState('');
  const progressTime = useTimeLeft(element.startedAt);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (text.length <= 0) {
      return;
    }

    onSubmit(text);
  };

  // 접속 시 무조건 focusing 되도록 해야 키보드가 올라온다.
  const taRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (taRef.current) {
      taRef.current.focus();
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    event.currentTarget.src = '/assets/write/img_error.svg';
  };

  useEffect(() => {
    const handleTouchOrClick = (e: MouseEvent | TouchEvent) => {
      if (
        taRef.current &&
        (taRef.current === e.target || taRef.current.contains(e.target as Node))
      ) {
        return;
      }

      setTimeout(() => {
        taRef.current?.focus();
      }, 0);
    };

    document.addEventListener('mousedown', handleTouchOrClick);
    document.addEventListener('touchstart', handleTouchOrClick);

    return () => {
      document.removeEventListener('mousedown', handleTouchOrClick);
      document.removeEventListener('touchstart', handleTouchOrClick);
    };
  }, []);

  const [mobile, setMobile] = useState(false);
  const [, setBottomOffset] = useState<number>(0);

  useEffect(() => {
    const checkInitialDevice = () => {
      const isMobile = window.innerWidth < 850;
      setMobile(isMobile); // 초기 화면 크기 기반 설정
    };

    checkInitialDevice();
  }, []);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    const handleResize = () => {
      let keyboardHeight = 0;
      if (window.visualViewport) {
        keyboardHeight = window.innerHeight - window.visualViewport.height;
      } else {
        keyboardHeight =
          window.innerHeight - document.documentElement.clientHeight;
      }

      keyboardHeight = Math.max(0, keyboardHeight); // 음수 방지

      if (window.innerWidth < 850) {
        setBottomOffset(keyboardHeight);
      } else {
        setBottomOffset(0);
      }

      setVh();
    };

    setVh();
    handleResize();

    window.addEventListener('resize', setVh);
    window.visualViewport?.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', setVh);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Container isMobile={mobile}>
      <Content
        isMobile={mobile}
        /*style={{
          height: `calc(var(--vh, 1vh) * 100 - ${bottomOffset}px)`,
          bottom: `${bottomOffset - 2}px`,
        }}*/
      >
        <Header isMobile={mobile}>
          <ClockText>
            <ClockIcon src="/assets/write/clock.svg" />
            {Math.max(0, Math.floor(progressTime))}초
          </ClockText>
          <CloseBtn onClick={handleClose} src="/assets/btn_close.svg" />
        </Header>
        <WriteDiv>
          <PhotoDiv isMobile={mobile}>
            <LetterImage src={element.imageUrl} onError={handleImageError} />
          </PhotoDiv>
          <WriteContent>
            <WriteTa
              ref={taRef}
              placeholder="그림을 보고 편지를 채워 주세요"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={40}
            />
            <ControlContainer>
              {text.length > 0 ? (
                <>
                  <CharacterCount>
                    <div
                      style={{ color: text.length > 30 ? '#FF0004' : 'black' }}
                    >
                      {text.length}
                    </div>
                    /30자
                  </CharacterCount>
                </>
              ) : (
                <>
                  <CharacterCount></CharacterCount>
                </>
              )}
              <CompleteBtn
                onClick={handleSubmit}
                $isdisabled={text.length === 0 || text.length > 30}
              >
                완료
              </CompleteBtn>
            </ControlContainer>
          </WriteContent>
        </WriteDiv>
      </Content>
    </Container>
  );
};

const WriteDiv = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  align-items: center;
`;
const Container = styled.div<{ isMobile: boolean }>`
  display: flex;

  flex-direction: column;

  align-items: center;
  ${({ isMobile }) => !isMobile && 'justify-content: center;'}

  width: 100vw;
  min-width: 300px;
  height: 100%;

  padding: 10px 0;

  overflow: hidden;

  background: rgba(0, 0, 0, 0.6);
`;

const Content = styled.div<{ isMobile: boolean }>`
  display: flex;

  flex-shrink: 0;
  flex-direction: column;

  align-items: flex-start;

  ${({ isMobile }) =>
    isMobile
      ? `
        width: 100%;
        height:100%;
        //height: calc(var(--vh, 1vh) * 100);
      `
      : `
        width: 95%;
        border-radius: 20px;

        
      `}

  background: white;
`;

const Header = styled.div<{ isMobile: boolean }>`
  display: flex;
  ${({ isMobile }) => isMobile && 'position: fixed;'}

  gap: 16px;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;

  ${({ isMobile }) => (isMobile ? 'width:90%;' : 'width:88%;')}
  height: 44px;

  margin: 10px 20px 5px 20px;
`;

const CloseBtn = styled.img`
  display: flex;

  flex-shrink: 0;

  align-items: center;
  justify-content: center;

  width: 20px;
  height: 20px;
`;

const ClockIcon = styled.img`
  display: flex;

  align-items: center;
  justify-content: center;

  width: 20px;
  height: 20px;

  margin: 0px 5px;
`;

const ClockText = styled.div`
  display: flex;

  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 700;

  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */

  color: var(--Color-primary-orange, #ffa256);

  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const PhotoDiv = styled.div<{ isMobile: boolean }>`
  display: flex;

  align-items: center;
  align-self: stretch;
  justify-content: center;

  margin: auto;
  margin-bottom: 16px;

  ${({ isMobile }) => (isMobile ? 'width:100%;' : 'width:160px;')}

  ${({ isMobile }) => isMobile && 'margin: 60px 0 16px 0;'}
  /* 위에 Header 고정이므로 약간 아래 띄움 */

  @media (max-width: 320px) {
    margin: 20px 0 16px 0; /* 좁은 해상도에서는 이미지 위로 붙음 */
  }
`;

const LetterImage = styled.img`
  width: 100%;
  min-width: 132px;
  max-width: 50vw; /* 디바이스 크기에 비례해서 커지도록 */
  min-height: 132px;
  aspect-ratio: 1 / 1;

  object-fit: cover;

  border-radius: 10px;

  @media (max-width: 320px) {
    max-width: 80vw; /* 작은 디바이스에선 좀 더 작게 */
  }
`;

const WriteContent = styled.div`
  display: flex;

  flex-direction: column;

  gap: 12px;
  align-items: center;
  align-self: stretch;
  justify-content: center;

  padding: 10px 14px;
  margin: 5px 20px 20px 20px;

  background: #f1f3f5;
  border: 1.172px dashed #ced4da;
  border-radius: 9.375px;
`;

const CompleteBtn = styled.div<{ $isdisabled: boolean }>`
  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 4px 12px;

  color: #fff;

  cursor: ${({ $isdisabled }) => ($isdisabled ? 'not-allowed' : 'pointer')};

  background: ${({ $isdisabled }) => ($isdisabled ? '#d3d3d3' : '#000')};
  border-radius: 4px;
`;

const WriteTa = styled.textarea`
  display: flex;

  flex-direction: column;

  gap: 10px;
  align-items: flex-start;
  align-self: stretch;

  width: 80%;

  overflow: hidden;

  color: #000;

  resize: none;

  background: #f1f3f5;
  border: none;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #6c757d;
  }
`;

const ControlContainer = styled.div`
  display: flex;

  justify-content: space-between;

  width: 100%;

  margin-top: 10px;
`;

const CharacterCount = styled.div`
  display: flex;

  font-size: 14px;

  color: #000;
`;
