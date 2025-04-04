import axios, {
  AxiosError,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from 'axios';
import { api, BaseResponse } from './api';
import { forceLogout } from './logout';
import { AccessTokenManager } from './accessTokenManager';

// TODO: /api prefix를 axios 인스턴스에 공통화
const refreshEndpoint = `${import.meta.env.VITE_SERVER_URL}/api/auth/refresh`;

export const fetchNewAccessToken = async () => {
  const response = await api.post(
    refreshEndpoint,
    {},
    {
      headers: {
        Authorization: null,
      },
    },
  );

  AccessTokenManager.getInstance().setAccessToken(
    `Bearer ${response.data.data.accessToken}`,
  );
};

// 동시 실행되는 요청들에 대해 토큰 갱신 요청을 공유하기 위함
let refreshRequest: Promise<void> | null = null;

export const attachAccessToken = (config: InternalAxiosRequestConfig) => {
  // NOTE: Refresh 요청 시에도 해당 Interceptor를 통과
  if (!refreshRequest) {
    config.headers.Authorization =
      AccessTokenManager.getInstance().getAccessToken();
  }
  return config;
};

export const awaitTokenRefresh = async (config: InternalAxiosRequestConfig) => {
  if (refreshRequest && config.headers && config.url !== refreshEndpoint) {
    try {
      await refreshRequest;
      attachAccessToken(config);
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

  if (error.response?.status === HttpStatusCode.Unauthorized) {
    if (!refreshRequest) {
      refreshRequest = (async () => {
        try {
          await fetchNewAccessToken();
          attachAccessToken(config);
        } catch (refreshError) {
          console.error('토큰 갱신 시도 실패:', refreshError);
          forceLogout();
          throw refreshError;
        } finally {
          refreshRequest = null;
        }
      })();
    }

    return api(config);
  }

  console.error('처리하지 못한 네트워크 오류:', error);

  // NOTE: error 객체를 반환하면 Promise.resolve()로 감싸져 성공 응답으로 처리되므로,
  // 명시적으로 Promise.reject()로 반환해야 한다.
  return Promise.reject(error);
};
