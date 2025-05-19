import { useEffect } from 'react';

import { Home } from '../../components/homePage/Home';

export const HomePage = () => {
  useEffect(() => {
    localStorage.removeItem('load');
    localStorage.removeItem('userName');
    localStorage.removeItem('guideOpen');
    localStorage.removeItem('receiver');
    localStorage.removeItem('myName');
    localStorage.removeItem('Date');
    localStorage.removeItem('title');
    localStorage.removeItem('image');
    localStorage.removeItem('bgImg');
    localStorage.removeItem('font');
  }, []);

  return (
    <>
      <Home />
    </>
  );
};
