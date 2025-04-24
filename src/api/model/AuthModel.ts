// 카카오 소셜 로그인 API Response
export interface AuthJwtPostResponse {
  accessToken: string;
  refreshToken: string;
}

//로그아웃 API Response
export type LogoutResponse = void;
