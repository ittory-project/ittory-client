import axios, {
  AxiosError,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from 'axios';
import { api, BaseResponse } from './api';
import { forceLogout } from './logout';
import {
  accessTokenRepository,
  refreshEndpoint,
} from './AccessTokenRepository';

export const attachAccessToken = (config: InternalAxiosRequestConfig) => {
  // NOTE: Refresh 요청 시에도 해당 Interceptor를 통과
  if (!accessTokenRepository.isRefreshing()) {
    config.headers.Authorization = accessTokenRepository.get();
  }
  return config;
};

export const awaitTokenRefresh = async (config: InternalAxiosRequestConfig) => {
  if (
    accessTokenRepository.isRefreshing() &&
    config.headers &&
    config.url !== refreshEndpoint
  ) {
    try {
      await accessTokenRepository.refresh();
      attachAccessToken(config);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
  return config;
};

// TODO: Sentry 등으로 오류 모니터링
export const tryTokenRefresh = async (
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

  if (error.response?.status === HttpStatusCode.Unauthorized) {
    if (config.url === refreshEndpoint) {
      return Promise.reject('Refresh 요청이 실패');
    }

    try {
      await accessTokenRepository.refresh();
      attachAccessToken(config);
    } catch (refreshError) {
      console.error('HTTP 요청 중 토큰 갱신에 실패:', refreshError);
      forceLogout();
      throw refreshError;
    }

    return api(config);
  }

  console.error('처리하지 못한 네트워크 오류:', error);

  // NOTE: error 객체를 반환하면 Promise.resolve()로 감싸져 성공 응답으로 처리되므로,
  // 명시적으로 Promise.reject()로 반환해야 한다.
  return Promise.reject(error);
};
