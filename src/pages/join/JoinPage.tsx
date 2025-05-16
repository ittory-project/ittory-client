import { Suspense } from 'react';

import { useNavigate } from 'react-router-dom';

import { accessTokenRepository } from '../../api/config/AccessTokenRepository';
import { Join } from '../../components/joinPage/Join';
import { usePreventBack } from '../../hooks';

export const JoinPage = () => {
  usePreventBack();

  const navigate = useNavigate();
  if (!accessTokenRepository.isLoggedIn()) {
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
