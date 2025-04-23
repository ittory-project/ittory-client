import axios, {
  AxiosError,
  AxiosResponse,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from 'axios';

import { SessionLogger } from '../../utils/SessionLogger';
import {
  accessTokenRepository,
  refreshEndpoint,
} from './AccessTokenRepository';
import { BaseResponse, api } from './api';
import { forceLogout } from './logout';

const logger = new SessionLogger('http');

export const logRequest = (config: InternalAxiosRequestConfig) => {
  logger.debug(
    `[Request] [${config.method?.toUpperCase()} ${config.url}] ${JSON.stringify(
      {
        params: config.params,
        data: config.data,
      },
    )}`,
  );
  return config;
};
export const logResponse = (response: AxiosResponse) => {
  logger.debug(
    `[Response] [${response.config.method?.toUpperCase()} ${response.config.url}] ${JSON.stringify(
      {
        status: response.status,
        data: response.data,
      },
    )}`,
  );
  return response;
};

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
    logger.error(`AxiosError가 아닌 네트워크 오류: ${error}`);
    return Promise.reject(error);
  }

  const config = error?.config;
  if (!config) {
    logger.error(`Axios Config 객체가 없는 네트워크 오류: ${error}`);
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
      logger.error('HTTP 요청 중 토큰 갱신에 실패:', refreshError);
      forceLogout();
      throw refreshError;
    }

    return api(config);
  }

  // NOTE: 전체 객체를 보내면 시인성이 부족
  // @ts-expect-error code, message 타입이 추론되지 않음 (실제로 존재)
  const { method, url, data, headers, code, message, response } = config;
  logger.error(
    `네트워크 오류: code: [${code}], message: [${message}], name: [${name}], url: [${method} ${url}], requestData: [${data}], headers: [${headers}], response: [${JSON.stringify(response)}]`,
  );

  // NOTE: error 객체를 반환하면 Promise.resolve()로 감싸져 성공 응답으로 처리되므로,
  // 명시적으로 Promise.reject()로 반환해야 한다.
  return Promise.reject(error);
};
