import { useEffect, useState } from 'react';

export const use100vh = (): number => {
  const [vh, setVh] = useState<number>(window.innerHeight * 0.01);

  useEffect(() => {
    // 최초 한 번만 실행
    const initialVh = window.innerHeight * 0.01;
    setVh(initialVh);
  }, []);

  return vh;
};
