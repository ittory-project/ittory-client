import { useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router';

import { kakaoLogin } from '../../api/config/kakaoLogin';
import { SessionLogger, SessionStore } from '../../utils';

const logger = new SessionLogger('login');

export const LoginRedirect = () => {
  const location = useLocation();
  const kakaoSocialLoginCode = new URLSearchParams(location.search).get('code');
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogin = async () => {
      if (!kakaoSocialLoginCode) {
        logger.debug('소셜 로그인 코드가 없습니다.');
        return;
      }

      await kakaoLogin(kakaoSocialLoginCode);

      const redirectUrl = SessionStore.getLoginRedirectUrl();
      navigate(redirectUrl ?? '/');
      SessionStore.clearLoginRedirectUrl();
    };

    handleLogin();
  }, [kakaoSocialLoginCode, navigate]);

  // TODO: Full Screen Loading 화면으로 대체
  return <div>로그인 중입니다</div>;
};
