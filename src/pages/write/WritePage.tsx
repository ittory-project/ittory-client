import { Suspense, useEffect, useState } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import CountdownGif from '@/assets/letter_start_count.gif';

import { letterQuery } from '../../api/queries';
import { Write } from '../../components/writePage/Write';
import { WriteMainModal } from '../../components/writePage/writeMainModal/WriteMainModal';
import { usePreventBack } from '../../hooks';

export const WritePage = () => {
  usePreventBack();

  const { letterId } = useParams();
  const letterNumId = Number(letterId);
  if (!letterNumId) {
    throw new Error('잘못된 접근입니다.');
  }
  const { data: startInfo } = useSuspenseQuery(
    letterQuery.startInfoById(letterNumId),
  );

  // 초기 팝업 띄우기
  const [showPopup, setShowPopup] = useState(true);
  const [showCountdown, setShowCountdown] = useState(false);
  // 편지 작성 시간 계산
  const storedResetTime = window.localStorage.getItem('resetTime');
  const [resetTime, setResetTime] = useState<number | null>(
    storedResetTime ? Number(storedResetTime) : null,
  );
  // 편지 시작까지 남은 시간 계산
  const [startCountdown, setStartCountdown] = useState<number>(10);

  // 모달 띄우는 시간 설정
  useEffect(() => {
    if (resetTime) {
      setShowPopup(false);
      setShowCountdown(false);
      return;
    }
    const countdownTimer = window.setInterval(() => {
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
        window.localStorage.setItem(
          'resetTime',
          String(Date.now() + 100 * 1000),
        );
      }, 4000);

      return () => {
        clearTimeout(hideTimer);
      };
    }, 10000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(countdownTimer);
    };
  }, []);

  return (
    <Container>
      {showPopup && (
        <WriteMainModal
          repeatCount={Number(startInfo.repeatCount)}
          elementCount={Number(startInfo.elementCount)}
          startCountdown={startCountdown}
        />
      )}
      {showCountdown && <Countdown src={CountdownGif} />}
      <Suspense>
        <Write />
      </Suspense>
    </Container>
  );
};

const Container = styled.div`
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
`;

const Countdown = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 6;

  width: 100%;
  height: 100%;

  background-color: rgba(0, 0, 0, 0.7);
`;
