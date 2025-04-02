import { postLogin } from '../service/AuthService';
import { api } from './api';
import { getKakaoToken, getUserId, setJwt, setUserId } from './setToken';

export const login = async (code: string) => {
  const kakaoToken = await getKakaoToken(code);
  if (!kakaoToken) {
    throw new Error('카카오 토큰 발급 실패');
  }

  const response = await postLogin(kakaoToken.accessToken);
  const newAuthorization = `Bearer ${response.accessToken}`;

  api.defaults.headers.common['Authorization'] = newAuthorization;
  setJwt(newAuthorization);
  setUserId(response.accessToken);
  console.log(`유저 아이디: ${getUserId()}`);
};
