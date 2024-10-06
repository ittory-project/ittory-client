import { api, ApiResponse } from "../config/api";
import { LoginJwtPostResponse } from "../model/LoginModel";

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