import { Suspense, useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { accessTokenRepository } from '../../api/config/AccessTokenRepository';
import { Join } from '../../components/joinPage/Join';
import { usePreventBack } from '../../hooks';
import { SessionStore } from '../../utils';

export const JoinPage = () => {
  usePreventBack();
  const location = useLocation();
  const navigate = useNavigate();

  // NOTE: navigate는 마운트 이후에만 동작
  useEffect(() => {
    if (!accessTokenRepository.isLoggedIn()) {
      SessionStore.setLoginRedirectUrl(location.pathname);
      navigate('/login');
    }
  }, [location.pathname, navigate]);

  if (!accessTokenRepository.isLoggedIn()) {
    return null;
  }

  return (
    <div>
      <Suspense>
        <Join />
      </Suspense>
    </div>
  );
};
