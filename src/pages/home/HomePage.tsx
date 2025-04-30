import { useEffect } from 'react';

import { accessTokenRepository } from '../../api/config/AccessTokenRepository';
import { quitLetterWs } from '../../api/service/WsService';
import { Home } from '../../components/homePage/Home';
import { SessionLogger } from '../../utils';

const logger = new SessionLogger('home');

export const HomePage = () => {
  useEffect(() => {
    if (localStorage.getItem('load')) {
      localStorage.removeItem('load');
    }
    if (localStorage.getItem('userName')) {
      localStorage.removeItem('userName');
      localStorage.removeItem('guideOpen');
    }
    if (localStorage.getItem('letterId')) {
      const letterId = Number(localStorage.getItem('letterId'));
      if (accessTokenRepository.isLoggedIn()) {
        quitLetterWs(letterId);
        logger.debug('소켓퇴장처리');
      }
      localStorage.removeItem('letterId');
    }
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
