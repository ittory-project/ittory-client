import { useEffect, useState } from "react";
import styled from "styled-components";
import { WriteMainModal } from "../../components/writePage/writeMainModal/WriteMainModal";
import { Write } from "../../components/writePage/Write";
import { useParams } from "react-router-dom";
import { decodeLetterId } from "../../api/config/base64";
import { LetterStartInfoGetResponse } from "../../api/model/LetterModel";
import { getLetterStartInfo } from "../../api/service/LetterService";
import CountdownGif from "../../../public/img/letter_start_count.gif";

export const WritePage = () => {
  const { letterId } = useParams()
  const [letterNumId] = useState(decodeLetterId(String(letterId)));
  const [letterTitle, setLetterTitle] = useState("");
  const [partiCount, setPartiCount] = useState<Number | null>()
  const [repeatCount, setRepeatCount] = useState<Number | null>()
  const [elementCount, setElementCount] = useState<Number | null>()

  const [showPopup, setShowPopup] = useState(true);
  const [showCountdown, setShowCountdown] = useState(false);

  const onClose = () => {
    setShowPopup(false);
  };

  const getStartInfo = async () => {
    if (!letterId) {
      window.alert("잘못된 접근입니다.")
    } else if (!letterNumId) {
      window.alert("잘못된 접근입니다.")
    } else {
      const response: LetterStartInfoGetResponse = await getLetterStartInfo(letterNumId);
      setLetterTitle(response.title)
      setPartiCount(response.participantCount)
      setRepeatCount(response.repeatCount)
      setElementCount(response.elementCount)
    }
  }
  useEffect(() => {
    getStartInfo()
  }, []);

  // 모달 띄우는 시간 계산
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCountdown(true);
    }, 15000);
    return () => clearTimeout(timer);
    // const timer2 = setTimeout(() => {
    //   setShowPopup(false);
    //   setShowCountdown(false);
    // }, 3000)
    // return () => clearTimeout(timer2);
  }, []);

  // 편지 작성 시간 계산
  const [progressTime, setProgressTime] = useState(100);
  useEffect(() => {
    const totalDuration = 100000;
    const interval = setInterval(() => {
      setProgressTime(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 0.1;
      });
    }, totalDuration / 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      {showPopup && 
        <WriteMainModal 
          onClose={onClose} 
          partiCount={Number(partiCount)} 
          repeatCount={Number(repeatCount)} 
          elementCount={Number(elementCount)}
          />}
      {showCountdown &&
        <Countdown src={CountdownGif} />
        }
      <Write 
        progressTime={progressTime} 
        setProgressTime={setProgressTime} 
        letterTitle={letterTitle}
        />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Countdown = styled.img`
`;