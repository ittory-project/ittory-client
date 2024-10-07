import { api, ApiResponse } from "../config/api";
import { AuthJwtPostResponse } from "../model/AuthModel";

// 로그인 API
// param: 카카오 액세스 토큰
// response: LoginJwtPostResponse - 서버의 토큰
export async function postLogin(accessToken: string): Promise<AuthJwtPostResponse> {
  const response: ApiResponse<AuthJwtPostResponse> = await api.post( 
    `/api/auth/login/kakao`,
    {
      accessToken,
    }
  );
  return response.data.data;
}