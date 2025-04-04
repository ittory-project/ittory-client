import { postLogin } from '../service/AuthService';
import { accessTokenRepository } from './AccessTokenRepository';
import { getKakaoToken, getUserId } from './setToken';

export const login = async (code: string) => {
  const kakaoToken = await getKakaoToken(code);
  if (!kakaoToken) {
    throw new Error('카카오 토큰 발급 실패');
  }

  const { accessToken } = await postLogin(kakaoToken.accessToken);
  accessTokenRepository.onLogin(accessToken);

  console.log(`유저 아이디: ${getUserId()}`);
};
