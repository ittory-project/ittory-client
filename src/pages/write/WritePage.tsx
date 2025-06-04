import { Suspense } from 'react';

import { useSuspenseQueries } from '@tanstack/react-query';
import { useParams } from 'react-router';
import styled from 'styled-components';

import CountdownGif from '@/assets/letter_start_count_no_loop.gif';

import { letterQuery } from '../../api/queries';
import { Write } from '../../components/writePage/Write';
import { WriteOrderPreviewModal } from '../../components/writePage/WriteOrderPreviewModal/WriteOrderPreviewModal';
import { usePreventBack } from '../../hooks';
import { useIntervalRerender } from '../../hooks/useIntervalRerender';
import { SessionLogger } from '../../utils';

const logger = new SessionLogger('write');

export const WritePage = () => {
  usePreventBack();

  const { letterId } = useParams();
  const letterNumId = Number(letterId);
  if (!letterNumId) {
    throw new Error('잘못된 접근입니다.');
  }
  const [{ data: startInfo }, { data: elements }] = useSuspenseQueries({
    queries: [
      letterQuery.startInfoById(letterNumId),
      letterQuery.elementsById(letterNumId),
    ],
  });

  const alreadyStarted = !!elements.some((element) => element.content);
  const startTime = elements[0].startedAt;
  const startTimeLeft = Math.floor(
    (new Date(startTime ?? new Date()).getTime() - new Date().getTime()) / 1000,
  );

  const showWriteOrderPopup = !alreadyStarted && startTimeLeft > 4;
  const showCountdown = startTimeLeft <= 4 && startTimeLeft >= 0;

  logger.debug(
    `showWriteOrderPopup: ${showWriteOrderPopup}\n, showCountdown: ${showCountdown}\n, startTimeLeft: ${startTimeLeft}\n, alreadyStarted: ${alreadyStarted}\n, startTime: ${startTime}`,
  );

  useIntervalRerender(!alreadyStarted && startTimeLeft >= 0, 1000);

  return (
    <Container>
      {showWriteOrderPopup && (
        <WriteOrderPreviewModal
          repeatCount={Number(startInfo.repeatCount)}
          elementCount={Number(startInfo.elementCount)}
          secondsLeft={startTimeLeft - 4}
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
  height: calc(var(--vh, 1vh) * 100);

  object-fit: cover;

  background-color: rgba(0, 0, 0, 0.7);
`;
