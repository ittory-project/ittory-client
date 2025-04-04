import { jwtDecode } from 'jwt-decode';

const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_KEY}&redirect_uri=${import.meta.env.VITE_LOGIN_REDIRECT}&response_type=code`;

export const getKakaoCode = async () => {
  window.location.href = KAKAO_AUTH_URI;
};

// 세션에서 유저 아이디 받아오기
export const getUserId = () => {
  const userId = window.localStorage.getItem('userId');
  return userId;
};

interface jwtType {
  exp: number;
  iat: number;
  role: string;
  sub: string;
  type: string;
}

// 세션에 유저 아이디 저장하기
export const setUserId = (jwt: string) => {
  const userId: jwtType = jwtDecode(jwt);
  console.log(userId);
  window.localStorage.setItem('userId', userId.sub);
};
