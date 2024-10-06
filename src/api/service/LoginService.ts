import { api, ApiResponse } from "../config/api";
import { LoginJwtPostResponse } from "../model/LoginModel";

// 로그인 API
// param: 카카오 액세스 토큰
// response: LoginJwtPostResponse - 서버의 토큰
export async function postLogin(accessToken: string): Promise<LoginJwtPostResponse> {
  const response: ApiResponse<LoginJwtPostResponse> = await api.post( 
    `/api/auth/login/kakao`,
    {
      accessToken,
    }
  );
  console.log(response);
  return response.data.data;
}