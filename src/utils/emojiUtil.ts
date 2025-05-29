// 1) 세그멘터 생성
const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

// 2) 제한 함수
export const sliceStringWithEmoji = (target: string, maxCount: number) => {
  const lettersWithWholeEmojis = Array.from(
    segmenter.segment(target),
    (s) => s.segment,
  );
  return {
    length: lettersWithWholeEmojis.length,
    value: lettersWithWholeEmojis.slice(0, maxCount).join(''),
  };
};
