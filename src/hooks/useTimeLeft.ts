import { useIntervalRerender } from './useIntervalRerender';

const OFFICIAL_TIME_LIMIT = 100;

// NOTE: write 쪽에서만 쓰이는 다소 local한 훅
export const useTimeLeft = (startedAt: string | null) => {
  const timeDiff =
    new Date().getTime() - new Date(startedAt ?? new Date()).getTime();
  const timeLeft = Math.max(
    0,
    OFFICIAL_TIME_LIMIT - Math.ceil(timeDiff / 1000),
  );

  useIntervalRerender(true, 1000);

  return timeLeft;
};
