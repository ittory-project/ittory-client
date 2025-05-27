export const smootherScrollToY = (targetY: number, duration = 800) => {
  const startY = window.scrollY;
  const deltaY = targetY - startY;
  const startTime = performance.now();

  // 원하는 easing 함수 (easeInOutCubic)
  function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function frame(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);

    window.scrollTo(0, startY + deltaY * eased);

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
};
