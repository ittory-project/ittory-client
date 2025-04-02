import axios, {
  AxiosError,
  AxiosRequestConfig,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from 'axios';
import { setJwt } from './setToken';
import { api, BaseResponse } from './api';
import { forceLogout } from './logout';

// TODO: /api prefix를 axios 인스턴스에 공통화
const refreshEndpoint = `${import.meta.env.VITE_SERVER_URL}/api/auth/refresh`;

export const GetNewAccessToken = async (
  config: AxiosRequestConfig,
): Promise<string> => {
  const response = await api.post(refreshEndpoint, {}, config);

  // TODO: 오류 모니터링
  if (!response.data.success) {
    console.error('토큰 갱신 실패', response.data);
  }

  return response.data.data.accessToken;
};

export const refreshAccessToken = async (
  originalRequest: AxiosRequestConfig | InternalAxiosRequestConfig,
) => {
  const newToken = await GetNewAccessToken(originalRequest);
  const newAuthorization = `Bearer ${newToken}`;

  // TODO: localStorage 방식 제거 시 함께 제거
  setJwt(newToken);
  api.defaults.headers.common['Authorization'] = newAuthorization;

  return newAuthorization;
};

// 동시 실행되는 요청들에 대해 토큰 갱신 요청을 공유하기 위함
let refreshRequest: Promise<string> | null = null;

export const awaitTokenRefresh = async (config: InternalAxiosRequestConfig) => {
  if (refreshRequest && config.headers) {
    try {
      const newAuthorization = await refreshRequest;
      config.headers.Authorization = newAuthorization;
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
  return config;
};

// TODO: Sentry 등으로 오류 모니터링
export const tryTokenRefrsh = async (
  error: AxiosError<BaseResponse<unknown>> | Error,
) => {
  // Q. throw로 처리하면 더 깔끔할 것 같은데 조사 필요
  if (!axios.isAxiosError(error)) {
    console.error(`AxiosError가 아닌 네트워크 오류: ${error}`);
    return Promise.reject(error);
  }

  const config = error?.config;
  if (!config) {
    console.error(`Axios Config 객체가 없는 네트워크 오류: ${error}`);
    return Promise.reject(error);
  }

  console.error('네트워크 오류:', error);

  if (error.response?.status === HttpStatusCode.Unauthorized) {
    if (!refreshRequest) {
      refreshRequest = new Promise<string>((resolve, reject) => {
        refreshAccessToken(config)
          .then((token) => {
            resolve(token);
          })
          .catch((refreshError) => {
            console.error('토큰 갱신 시도 실패:', refreshError);
            forceLogout();
            reject(refreshError);
          });
      });
    }

    const newAuthorization = await refreshRequest;
    config.headers.Authorization = newAuthorization;
    return api(config);
  }

  // NOTE: error 객체를 반환하면 Promise.resolve()로 감싸져 성공 응답으로 처리되므로,
  // 명시적으로 Promise.reject()로 반환해야 한다.
  return Promise.reject(error);
};
