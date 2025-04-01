import { useEffect } from 'react';
import {
  getJwt,
  getKakaoToken,
  getUserId,
  setJwt,
  setUserId,
} from '../../api/config/setToken';
import { useNavigate } from 'react-router-dom';
import { postLogin } from '../../api/service/AuthService';
import { api } from '../../api/config/api';

export const LoginRedirect = () => {
  const code = new URL(window.location.href).searchParams.get('code');
  const navigate = useNavigate();

  const login = async (code: string) => {
    try {
      const kakaoToken = await getKakaoToken(code);
      if (kakaoToken) {
        const response = await postLogin(kakaoToken.accessToken);

        api.defaults.headers.common['Authorization'] =
          `Bearer ${response.accessToken}`;

        setJwt(response.accessToken);
        const jwt = getJwt();
        if (jwt) {
          setUserId(jwt);
          console.log(`유저 아이디: ${getUserId()}`);

          // TODO: login 함수에서 로직 분리하기
          if (localStorage.letterId) {
            const letterId = localStorage.letterId;
            console.log(letterId);
            navigate(`/join/${letterId}`);
          } else {
            navigate('/');
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (code) {
      login(code);
    }
  }, [code]);

  // TODO: Full Screen Loading 화면으로 대체
  return <div>로그인 중입니다</div>;
};
