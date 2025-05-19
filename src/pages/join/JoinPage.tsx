import { Suspense } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { accessTokenRepository } from '../../api/config/AccessTokenRepository';
import { Join } from '../../components/joinPage/Join';
import { usePreventBack } from '../../hooks';
import { SessionStore } from '../../utils';

export const JoinPage = () => {
  usePreventBack();
  const location = useLocation();
  const navigate = useNavigate();

  if (!accessTokenRepository.isLoggedIn()) {
    SessionStore.setLoginRedirectUrl(location.pathname);
    navigate('/login');
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
