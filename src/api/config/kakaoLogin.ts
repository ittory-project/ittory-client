import { requestKakaoAuthentication } from '../service/AuthService';
import { accessTokenRepository } from './AccessTokenRepository';
import { getUserId } from './setToken';

export const kakaoLogin = async (kakaoSocialLoginCode: string) => {
  const { accessToken } =
    await requestKakaoAuthentication(kakaoSocialLoginCode);
  accessTokenRepository.onLogin(accessToken);

  console.log(`유저 아이디: ${getUserId()}`);
};
