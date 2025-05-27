import { getHostUrl } from '@/utils';

const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_KEY}&redirect_uri=${getHostUrl()}/login/redirect&response_type=code`;

export const getKakaoCode = async () => {
  window.location.href = KAKAO_AUTH_URI;
};
