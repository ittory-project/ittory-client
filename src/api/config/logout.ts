import { postLogout } from '../service/AuthService';
import { accessTokenRepository } from './AccessTokenRepository';

// TODO: 안내 및 네비게이션 수행 (안내는 토스트로도 가능할듯?)
export const forceLogout = async () => {
  // NOTE: 로그인 상태가 아닐 때 로그아웃 실행 시 무한루프 발생
  if (accessTokenRepository.isLoggedIn()) {
    await postLogout();
  }

  window.location.href = '/';
};
