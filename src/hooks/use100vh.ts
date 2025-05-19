import { useEffect, useState } from 'react';

export const use100vh = (): number => {
  const [vh, setVh] = useState<number>(window.innerHeight * 0.01);

  useEffect(() => {
    const updateVh = () => {
      setVh(window.innerHeight * 0.01);
    };

    window.addEventListener('resize', updateVh);
    updateVh(); // 초기 실행

    return () => window.removeEventListener('resize', updateVh);
  }, []);

  return vh;
};
