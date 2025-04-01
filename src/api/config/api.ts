import axios, { AxiosError, AxiosResponse, HttpStatusCode } from 'axios';
import { getJwt } from './setToken';
import { API_ERROR_CODE } from './constants';
import { refreshAccessToken } from './tokenRefresh';
import { forceLogout } from './logout';

export interface BaseResponse<T = unknown> {
  success: boolean;
  status: number;
  data: T;
}

export interface BaseError {
  success: boolean;
  status: number;
  code: string;
  message: string;
  info?: string;
}

export type ApiResponse<T> = AxiosResponse<BaseResponse<T>>;

const apiSetting = {
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 5000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

// TODO: Sentry 등으로 오류 모니터링
const errorHandler = async (
  error: AxiosError<BaseResponse<unknown>> | Error,
) => {
  if (!axios.isAxiosError(error)) {
    console.error(`AxiosError가 아닌 네트워크 오류: ${error}`);
    throw error;
  }

  console.error('네트워크 오류:', error);
  if (
    error.response?.status === HttpStatusCode.Unauthorized &&
    error.response?.data?.code === API_ERROR_CODE.INVALID_ACCESS_TOKEN &&
    error.config
  ) {
    try {
      refreshAccessToken(error.config);
      // NOTE: axios는 axios.post와 같은 요청 함수이다.
      // originalRequest는 단순한 설정 객체이므로, 반환하면 요청이 발생하지 않고, 그냥 설정 객체가 호출 측에 넘겨진다.
      return axios(error.config);
    } catch (refreshError) {
      console.error('토큰 갱신 시도 실패:', refreshError);
      forceLogout();
    }
  }

  // NOTE: error 객체를 반환하면 Promise.resolve()로 감싸져 성공 응답으로 처리되므로,
  // 명시적으로 Promise.reject()로 반환해야 한다.
  return Promise.reject(error);
};

export const api = axios.create(apiSetting);

// localStorage에서 Access Token 불러옴
// TODO: localStorage 방식 제거 시 함께 제거
api.defaults.headers.common['Authorization'] = `Bearer ${getJwt()}`;

api.interceptors.response.use(null, errorHandler);
