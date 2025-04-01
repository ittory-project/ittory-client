import axios, { AxiosRequestConfig } from 'axios';
import { setJwt } from './setToken';

const refreshEndpoint = `${import.meta.env.VITE_SERVER_URL}/auth/refresh`;

export const GetNewAccessToken = async (
  config: AxiosRequestConfig,
): Promise<string> => {
  const response = await axios.post(refreshEndpoint, {}, config);

  // TODO: 오류 모니터링
  if (!response.data.success) {
    console.error('토큰 갱신 실패', response.data);
  }

  return response.data.data.accessToken;
};

export const refreshAccessToken = async (
  originalRequest: AxiosRequestConfig,
) => {
  const newToken = await GetNewAccessToken(originalRequest);

  // TODO: localStorage 방식 제거 시 함께 제거
  setJwt(newToken);
  axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
};
