import { setJwt } from './setToken';

// TODO: 안내 및 네비게이션 수행 (안내는 토스트로도 가능할듯?)
export const forceLogout = () => {
  setJwt('');
  window.location.href = '/login';
};
