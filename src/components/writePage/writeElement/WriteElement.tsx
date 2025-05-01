import { useEffect, useRef, useState } from 'react';

import { Client } from '@stomp/stompjs';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { decodeLetterId } from '../../../api/config/base64';
import { ElementImgGetResponse } from '../../../api/model/ElementModel';
import { getElementImg } from '../../../api/service/ElementService';

interface WriteElementProps {
  sequence: number;
  setShowSubmitPage: React.Dispatch<React.SetStateAction<boolean>>;
  progressTime: number;
  clientRef: React.MutableRefObject<Client | null>;
}

export const WriteElement = ({
  sequence,
  setShowSubmitPage,
  progressTime,
  clientRef,
}: WriteElementProps) => {
  const [text, setText] = useState('');
  const { letterId } = useParams();
  const [letterNumId] = useState(decodeLetterId(String(letterId)));

  const [elementImg, setElementImg] = useState('');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const getLetterImg = async () => {
    if (!letterId) {
      window.alert('잘못된 접근입니다.');
    } else if (!letterNumId) {
      window.alert('잘못된 접근입니다.');
    } else {
      const response: ElementImgGetResponse = await getElementImg(
        letterNumId,
        sequence,
      );
      setElementImg(response.elementImageUrl);
    }
  };
  useEffect(() => {
    getLetterImg();
  }, []);

  const handleExit = () => {
    setShowSubmitPage(false);
  };

  useEffect(() => {
    if (progressTime <= 0.5) {
      if (text.length > 0) {
        handleWriteComplete();
      }
    }
  }, [progressTime]);

  // 작성 완료 버튼
  const handleWriteComplete = async () => {
    if (!sequence) {
      return window.alert('오류');
    }
    if (text.length <= 0) {
      return;
    }
    // writeLetterWs 완료 여부를 기다림
    // await writeLetterWs(letterNumId, Number(repeat), text);
    // clientRef를 통해 client 객체에 접근
    clientRef.current?.publish({
      destination: `/ws/letter/${letterNumId}/elements`,
      body: JSON.stringify({ sequence: sequence, content: text }),
    });
  };

  // 접속 시 무조건 focusing 되도록 해야 키보드가 올라온다.
  const taRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (taRef.current) {
      taRef.current.focus();
    }
  }, []);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 850);
  };
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // const handleKeyboardEnterEvent = (e: KeyboardEvent<HTMLTextAreaElement>) => {
  //   e.preventDefault();
  //   handleWriteComplete();
  // }

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    event.currentTarget.src = '/assets/write/img_error.svg';
  };

  useEffect(() => {
    const handleTouchOrClick = (e: MouseEvent | TouchEvent) => {
      // 클릭 대상이 textarea나 자식이면 무시
      if (
        taRef.current &&
        (taRef.current === e.target || taRef.current.contains(e.target as Node))
      ) {
        return;
      }
      // 강제로 다시 focus 줌
      taRef.current?.focus();
    };

    document.addEventListener('mousedown', handleTouchOrClick);
    document.addEventListener('touchstart', handleTouchOrClick);

    return () => {
      document.removeEventListener('mousedown', handleTouchOrClick);
      document.removeEventListener('touchstart', handleTouchOrClick);
    };
  }, []);

  return (
    <Container isMobile={isMobile}>
      <Content isMobile={isMobile}>
        <Header>
          <ClockText>
            <ClockIcon src="/assets/write/clock.svg" />
            {Math.max(0, Math.floor(progressTime))}초
          </ClockText>
          <CloseBtn onClick={handleExit} src="/assets/btn_close.svg" />
        </Header>
        <WriteContent>
          <PhotoDiv>
            <LetterImage src={'' + elementImg} onError={handleImageError} />
          </PhotoDiv>
          <WriteTa
            ref={taRef}
            placeholder="그림을 보고 편지를 채워 주세요"
            value={text}
            onChange={(e) => setText(e.target.value)}
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
              onClick={handleWriteComplete}
              $isdisabled={text.length === 0 || text.length > 30}
            >
              완료
            </CompleteBtn>
          </ControlContainer>
        </WriteContent>
      </Content>
    </Container>
  );
};

const Container = styled.div<{ isMobile: boolean }>`
  display: flex;

  flex-direction: column;

  align-items: center;
  //justify-content: center;
  ${({ isMobile }) => !isMobile && 'justify-content: center;'}

  width: 100vw;
  min-width: 300px;
  height: calc(var(--vh, 1vh) * 100);

  padding: 10px 0;

  background-color: #212529;
`;

const Content = styled.div<{ isMobile: boolean }>`
  display: flex;

  flex-shrink: 0;
  flex-direction: column;

  align-items: flex-start;

  ${({ isMobile }) => (isMobile ? 'width:100%;' : 'width:95%;')}
  //width: 95%;
  ${({ isMobile }) => isMobile && 'margin-top:5%;'}

  background: var(--color-black-white-white, #fff);
  border-radius: 20px;
`;

const Header = styled.div`
  display: flex;

  gap: 16px;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;

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

const WriteContent = styled.div`
  display: flex;

  flex-direction: column;

  gap: 10px;
  align-items: center;
  align-self: stretch;
  justify-content: center;

  height: 270px;

  padding: 16px;
  margin: 5px 20px 20px 20px;

  background: var(--Color-grayscale-gray50, #f8f9fa);
  border: 1px dashed var(--Color-grayscale-gray400, #ced4da);
  border-radius: var(--Border-Radius-radius_300, 8px);
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

const PhotoDiv = styled.div`
  display: flex;

  justify-content: center;
`;

const LetterImage = styled.img`
  width: 164px;
  height: 164px;

  object-fit: cover;

  border-radius: 10px;
`;

const WriteTa = styled.textarea`
  display: flex;

  flex-direction: column;

  gap: 10px;
  align-items: flex-start;
  align-self: stretch;

  width: 80%;

  padding: 16px;
  margin: 0 auto;

  overflow: hidden;

  color: #000;

  resize: none;

  background: var(--Color-grayscale-gray50, #f8f9fa);
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
