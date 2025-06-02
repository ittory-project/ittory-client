import { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import btnClose from '@/assets/btn_close.svg';
import clock from '@/assets/write/clock.svg';
import imgError from '@/assets/write/img_error.svg';
import { Policies } from '@/constants';
import {
  isMobileDevice,
  sliceStringWithEmoji,
  smootherScrollToY,
} from '@/utils';

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
  const isMobile = isMobileDevice();

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (text.length <= 0) {
      return;
    }

    onSubmit(text);
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    // 최초 접속 시에는 스크롤 없이 올리도록 지정 가능함
    textareaRef.current?.focus({
      preventScroll: true,
    });

    // iOS만 필요한 것일 수 있음
    textareaRef.current?.addEventListener('focus', () => {
      setTimeout(() => {
        smootherScrollToY(0);
      }, 150);
    });
  }, []);

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    event.currentTarget.src = imgError;
  };

  return (
    <Container $isMobile={isMobile}>
      <Content $isMobile={isMobile}>
        <Header $isMobile={isMobile}>
          <ClockText>
            <ClockIcon src={clock} />
            {Math.max(0, Math.floor(progressTime))}초
          </ClockText>
          <CloseBtn onClick={handleClose} src={btnClose} />
        </Header>
        <WriteDiv>
          <PhotoDiv $isMobile={isMobile}>
            <LetterImage src={element.imageUrl} onError={handleImageError} />
          </PhotoDiv>
          <WriteContent>
            <WriteTa
              ref={textareaRef}
              placeholder="그림을 보고 편지를 채워 주세요"
              value={text}
              onChange={(e) => {
                const validated = sliceStringWithEmoji(
                  e.target.value,
                  Policies.LETTER_CONTENT_MAX_LENGTH,
                );
                setText(validated.value);
              }}
            />
            <ControlContainer>
              {text.length > 0 ? (
                <>
                  <CharacterCount>
                    <div
                      style={{
                        color: text.length > 30 ? '#FF0004' : 'black',
                      }}
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
  position: relative;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 100%;
`;
const Container = styled.div<{ $isMobile: boolean }>`
  display: flex;

  flex-direction: column;

  align-items: center;
  ${({ $isMobile }) => !$isMobile && 'justify-content: center;'}

  width: 100vw;
  min-width: 300px;
  height: ${({ $isMobile }) =>
    $isMobile ? 'calc(var(--vh, 1vh) * 100)' : '100%'};

  padding: 10px 0;

  ${({ $isMobile }) => !$isMobile && 'overflow-y: hidden;'}

  background: ${({ $isMobile }) =>
    $isMobile ? 'white' : 'rgba(0, 0, 0, 0.6);'}
`;

const Content = styled.div<{ $isMobile: boolean }>`
  display: flex;

  flex-shrink: 0;
  flex-direction: column;

  align-items: flex-start;

  background: white;

  ${({ $isMobile }) =>
    $isMobile
      ? `
        width: 100%;
        height:100%;
      }
      `
      : `
        width: 95%;
        border-radius: 20px; 
      `}
`;

const Header = styled.div<{ $isMobile: boolean }>`
  position: absolute;
  z-index: 1;

  display: flex;

  gap: 16px;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;

  ${({ $isMobile }) => ($isMobile ? 'width:90%;' : 'width:88%;')}
  height: 44px;

  margin: 10px 20px 5px 20px;
  margin-bottom: 44px;
`;

const CloseBtn = styled.img`
  display: flex;

  flex-shrink: 0;

  align-items: center;
  justify-content: center;

  width: 20px;
  height: 20px;

  cursor: pointer;
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

const PhotoDiv = styled.div<{ $isMobile: boolean }>`
  display: flex;

  align-items: center;
  align-self: stretch;
  justify-content: center;

  margin: 60px auto 16px auto;

  ${({ $isMobile }) => ($isMobile ? 'width:100%;' : 'width:160px;')}

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

  overflow: hidden;

  font-size: 14px;

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
