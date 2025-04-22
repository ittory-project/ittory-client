import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { kakaoLogin } from '../../api/config/kakaoLogin';
import { SessionLogger } from '../../utils';

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

      try {
        await kakaoLogin(kakaoSocialLoginCode);

        if (localStorage.letterId) {
          const letterId = localStorage.letterId;
          navigate(`/join/${letterId}`);
        } else {
          navigate('/');
        }
      } catch (error) {
        // TODO: 오류 설명을 띄우기
        logger.error('소셜 로그인 도중 오류 발생', error);
      }
    };

    handleLogin();
  }, [kakaoSocialLoginCode, navigate]);

  // TODO: Full Screen Loading 화면으로 대체
  return <div>로그인 중입니다</div>;
};
