import { requestKakaoAuthentication } from '../service/AuthService';
import { accessTokenRepository } from './AccessTokenRepository';
import { getUserIdFromLocalStorage, setUserIdOnLocalStorage } from './setToken';

export const kakaoLogin = async (kakaoSocialLoginCode: string) => {
  const { accessToken } =
    await requestKakaoAuthentication(kakaoSocialLoginCode);
  accessTokenRepository.onLogin(accessToken);

  // NOTE: 현재 로컬스토리지로 유저id 공유 중이어서 아직 필요...
  setUserIdOnLocalStorage(accessToken);

  console.log(`유저 아이디: ${getUserIdFromLocalStorage()}`);
};
