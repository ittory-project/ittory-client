import { requestKakaoAuthentication } from '../service/AuthService';
import { accessTokenRepository } from './AccessTokenRepository';

export const kakaoLogin = async (kakaoSocialLoginCode: string) => {
  const { accessToken } =
    await requestKakaoAuthentication(kakaoSocialLoginCode);
  accessTokenRepository.onLogin(accessToken);
};
