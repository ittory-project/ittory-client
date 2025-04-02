import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../../api/config/login';

export const LoginRedirect = () => {
  const location = useLocation();
  const kakaoSocialLoginCode = new URLSearchParams(location.search).get('code');
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogin = async () => {
      if (!kakaoSocialLoginCode) {
        console.log('소셜 로그인 코드가 없습니다.');
        return;
      }

      try {
        await login(kakaoSocialLoginCode);

        if (localStorage.letterId) {
          const letterId = localStorage.letterId;
          navigate(`/join/${letterId}`);
        } else {
          navigate('/');
        }
      } catch (error) {
        // TODO: 오류 설명을 띄우기
        console.error(error);
      }
    };

    handleLogin();
  }, [kakaoSocialLoginCode, navigate]);

  // TODO: Full Screen Loading 화면으로 대체
  return <div>로그인 중입니다</div>;
};
