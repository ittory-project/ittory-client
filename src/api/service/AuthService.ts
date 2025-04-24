import { ApiResponse, BaseResponse, api } from '../config/api';
import {
  AuthJwtPostResponse,
  LogoutResponse,
  TemporaryLoginResponse,
} from '../model/AuthModel';

export async function requestKakaoAuthentication(
  authorizationCode: string,
): Promise<AuthJwtPostResponse> {
  const response: ApiResponse<AuthJwtPostResponse> = await api.post(
    `/api/auth/login/kakao`,
    {
      authorizationCode,
    },
  );
  return response.data.data;
}

//로그아웃
export async function postLogout(): Promise<LogoutResponse> {
  const response = await api.post<LogoutResponse>(`/api/auth/logout`);
  return response.data;
}

// 임시 로그인 기능
export async function postTemporaryLogin(loginId: string) {
  const response = await api.post<BaseResponse<TemporaryLoginResponse>>(
    `/api/auth/login/id`,
    {
      loginId,
    },
  );

  return response.data.data;
}
