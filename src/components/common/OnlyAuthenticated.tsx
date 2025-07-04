import { PropsWithChildren, useEffect, useState } from 'react';

import { Navigate, Outlet } from 'react-router';

import { accessTokenRepository } from '@/api/config/AccessTokenRepository';
import { SessionStore } from '@/utils';

interface OnlyAuthenticatedProps {
  fallback?: React.ReactNode;
}

export const OnlyAuthenticated = ({
  children,
  fallback = <Navigate to="/login" />,
}: PropsWithChildren<OnlyAuthenticatedProps>) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    accessTokenRepository.isLoggedIn(),
  );

  useEffect(() => {
    const listener = () => {
      setIsLoggedIn(accessTokenRepository.isLoggedIn());
    };

    accessTokenRepository.addStageChangeListener(listener);
    return () => accessTokenRepository.removeStageChangeListener(listener);
  }, []);

  if (!isLoggedIn) {
    SessionStore.setLoginRedirectUrl(window.location.pathname);
    return fallback;
  }

  return children || <Outlet />;
};
