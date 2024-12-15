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
  const { letterId } = useParams();
  const [letterNumId] = useState(decodeLetterId(String(letterId)));
  // 불러온 편지 정보
  const [letterTitle, setLetterTitle] = useState("");
  const [partiCount, setPartiCount] = useState<Number | null>();
  const [repeatCount, setRepeatCount] = useState<Number | null>();
  const [elementCount, setElementCount] = useState<Number | null>();
  // 초기 팝업 띄우기
  const [showPopup, setShowPopup] = useState(true);
  const [showCountdown, setShowCountdown] = useState(false);
  // 편지 작성 시간 계산
  const storedResetTime = window.localStorage.getItem("resetTime");
  const [resetTime, setResetTime] = useState<number | null>(storedResetTime ? Number(storedResetTime) : null);
  const [remainingTime, setRemainingTime] = useState(100); // 남은 시간을 보여줄 상태
  // 편지 시작까지 남은 시간 계산
  const [startCountdown, setStartCountdown] = useState<number>(10);

  const getStartInfo = async () => {
    if (!letterId) {
      window.alert("잘못된 접근입니다.");
    } else if (!letterNumId) {
      window.alert("잘못된 접근입니다.");
    } else {
      const response: LetterStartInfoGetResponse =
        await getLetterStartInfo(letterNumId);
      setLetterTitle(response.title);
      setPartiCount(response.participantCount);
      setRepeatCount(response.repeatCount);
      setElementCount(response.elementCount);
    }
  };
  useEffect(() => {
    getStartInfo();
  }, []);

  // 모달 띄우는 시간 설정
  useEffect(() => {
    if (resetTime) {
      setShowPopup(false)
      setShowCountdown(false)
      return;
    }
    let countdownTimer: number;
    countdownTimer = window.setInterval(() => {
      setStartCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const showTimer = setTimeout(() => {
      setShowPopup(false);
      setShowCountdown(true);

      const hideTimer = setTimeout(() => {
        setShowCountdown(false);
        setResetTime(Date.now() + 100 * 1000);
        window.localStorage.setItem("resetTime", String(Date.now() + 100 * 1000));
      }, 4000);

      return () => {
        clearTimeout(hideTimer);
      }
    }, 10000);

    return () => {
      clearTimeout(showTimer)
      clearTimeout(countdownTimer)
    };
  }, []);

  // 남은 시간을 업데이트하는 useEffect
  useEffect(() => {
    if (resetTime === null) return;
    const interval = setInterval(() => {
      const timeLeft = (resetTime - Date.now()) / 1000; // 남은 시간을 초 단위로 계산
      setRemainingTime(timeLeft);
    }, 100);

    return () => clearInterval(interval);
  }, [resetTime]);

  return (
    <Container>
      {showPopup && (
        <WriteMainModal
          partiCount={Number(partiCount)}
          repeatCount={Number(repeatCount)}
          elementCount={Number(elementCount)}
          startCountdown={startCountdown}
        />
      )}
      {showCountdown && <Countdown src={CountdownGif} />}
      <Write
        remainingTime={resetTime ? remainingTime : 100}
        // resetTime={resetTime}
        setResetTime={setResetTime}
        letterTitle={letterTitle}
      />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Countdown = styled.img`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 6;
`;
