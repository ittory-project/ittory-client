import { Home } from '../../components/homePage/Home';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quitLetterWs } from '../../api/service/WsService';
import { SessionLogger } from '../../utils';
import { accessTokenRepository } from '../../api/config/AccessTokenRepository';

const logger = new SessionLogger('home');

export const HomePage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/', { replace: true });
  };
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    window.history.replaceState(null, '', window.location.href);

    window.addEventListener('popstate', handleGoBack);

    return () => {
      window.removeEventListener('popstate', handleGoBack);
    };
  }, []);

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    window.history.replaceState(null, '', window.location.href);

    window.addEventListener('popstate', handleGoBack);

    return () => {
      window.removeEventListener('popstate', handleGoBack);
    };
  }, [navigate]);

  useEffect(() => {
    // 현재 페이지를 히스토리에 추가하여 뒤로가기 할 수 없게 함
    window.history.pushState(null, '', window.location.href);
    window.history.replaceState(null, '', window.location.href);

    window.addEventListener('popstate', handleGoBack);

    return () => {
      window.removeEventListener('popstate', handleGoBack);
    };
  }, [location]);

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
