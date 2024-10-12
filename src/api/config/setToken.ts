import axios from "axios";
import { AuthJwtPostResponse } from "../model/AuthModel";
import { jwtDecode } from "jwt-decode";

// 카카오 인가 코드 받기
export const getKakaoCode = async () => {
  try {
    const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_KEY}&redirect_uri=${import.meta.env.VITE_LOGIN_REDIRECT}&response_type=code`;
    window.location.href = KAKAO_AUTH_URI;
  } catch (e) {}
};

// 카카오 토큰 응답
interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
}

// 카카오 토큰 받기
export const getKakaoToken = async (
  code: string
): Promise<AuthJwtPostResponse | null> => {
  try {
    const response = await axios.post<KakaoTokenResponse>(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: import.meta.env.VITE_KAKAO_KEY,
        client_secret: import.meta.env.VITE_KAKAO_SECRET,
        redirect_uri: import.meta.env.VITE_LOGIN_REDIRECT,
        code,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const token: AuthJwtPostResponse = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };
    return token;
  } catch (error) {
    console.error("카카오 로그인 연결 실패:", error);
    return null;
  }
};

// 세션에서 JWT(서버) 받아오기
export const getJwt = () => {
  const jwt = window.localStorage.getItem("jwt");
  if (jwt) {
    return jwt;
  } else {
    console.error("회원 정보가 존재하지 않습니다.");
    return null;
  }
};

// 세션에 JWT(서버) 저장하기
export const setJwt = (code: string) => {
  window.localStorage.setItem("jwt", code);
};

export const getUserId = () => {
  const userId = window.localStorage.getItem("userId");
  return userId;
};

interface jwtType {
  exp: number;
  iat: number;
  role: string;
  sub: string;
  type: string;
}

export const setUserId = (jwt: string) => {
  const userId: jwtType = jwtDecode(jwt);
  console.log(userId);
  window.localStorage.setItem("userId", userId.sub);
};
