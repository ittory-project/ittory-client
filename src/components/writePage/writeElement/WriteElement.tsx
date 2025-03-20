import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { decodeLetterId } from "../../../api/config/base64";
import { Client } from "@stomp/stompjs";
import { getElementImg } from "../../../api/service/ElementService";
import { ElementImgGetResponse } from "../../../api/model/ElementModel";

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
  const [text, setText] = useState("");
  const { letterId } = useParams();
  const [letterNumId] = useState(decodeLetterId(String(letterId)));

  const [elementImg, setElementImg] = useState("");

  const getLetterImg = async () => {
    if (!letterId) {
      window.alert("잘못된 접근입니다.");
    } else if (!letterNumId) {
      window.alert("잘못된 접근입니다.");
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
      } else {
      }
    }
  }, [progressTime]);

  // 작성 완료 버튼
  const handleWriteComplete = async () => {
    if (!sequence) {
      return window.alert("오류");
    }
    if (text.length <= 0) {
      return;
    }
    try {
      console.log(sequence, text);
      // writeLetterWs 완료 여부를 기다림
      // await writeLetterWs(letterNumId, Number(repeat), text);
      // clientRef를 통해 client 객체에 접근
      clientRef.current?.publish({
        destination: `/ws/letter/${letterNumId}/elements`,
        body: JSON.stringify({ sequence: sequence, content: text }),
      });
    } catch (e) {
      console.log(e);
    }
  };

  // 접속 시 무조건 focusing 되도록 해야 키보드가 올라온다.
  const taRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (taRef.current) {
      taRef.current.focus();
    }
  }, []);

  // const handleKeyboardEnterEvent = (e: KeyboardEvent<HTMLTextAreaElement>) => {
  //   e.preventDefault();
  //   handleWriteComplete();
  // }

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    event.currentTarget.src = "/assets/write/img_error.svg";
  };

  return (
    <Container>
      <Content>
        <Header>
          <ClockText>
            <ClockIcon src="/assets/write/clock.svg" />
            {Math.max(0, Math.floor(progressTime))}초
          </ClockText>
          <CloseBtn onClick={handleExit} src="/assets/btn_close.svg" />
        </Header>
        <WriteContent>
          <PhotoDiv>
            <LetterImage src={"" + elementImg} onError={handleImageError} />
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
                    style={{ color: text.length > 30 ? "#FF0004" : "black" }}
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

const Container = styled.div`
  height: calc(var(--vh, 1vh) * 100);
  width: 100vw;
  min-width: 300px;
  padding: 10px 0;
  background-color: #212529;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  width: 95%;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  border-radius: 20px;
  background: var(--color-black-white-white, #fff);
`;

const Header = styled.div`
  display: flex;
  height: 44px;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  margin: 10px 20px 5px 20px;
  justify-content: space-between;
`;

const CloseBtn = styled.img`
  display: flex;
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const ClockIcon = styled.img`
  display: flex;
  width: 20px;
  height: 20px;
  margin: 0px 5px;
  justify-content: center;
  align-items: center;
`;

const ClockText = styled.div`
  display: flex;
  color: var(--Color-primary-orange, #ffa256);
  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const WriteContent = styled.div`
  display: flex;
  height: 270px;
  margin: 5px 20px 20px 20px;
  padding: 16px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  align-self: stretch;
  border-radius: var(--Border-Radius-radius_300, 8px);
  border: 1px dashed var(--Color-grayscale-gray400, #ced4da);
  background: var(--Color-grayscale-gray50, #f8f9fa);
`;

const CompleteBtn = styled.div<{ $isdisabled: boolean }>`
  display: flex;
  padding: 4px 12px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background: ${({ $isdisabled }) => ($isdisabled ? "#d3d3d3" : "#000")};
  color: #fff;
  cursor: ${({ $isdisabled }) => ($isdisabled ? "not-allowed" : "pointer")};
`;

const PhotoDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const LetterImage = styled.img`
  width: 164px;
  height: 164px;
  border-radius: 10px;
  object-fit: cover;
`;

const WriteTa = styled.textarea`
  display: flex;
  width: 80%;
  padding: 16px;
  margin: 0 auto;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  border: none;
  resize: none;
  color: #000;
  background: var(--Color-grayscale-gray50, #f8f9fa);
  overflow: hidden;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #6c757d;
  }
`;

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 10px;
`;

const CharacterCount = styled.div`
  color: #000;
  display: flex;
  font-size: 14px;
`;
