import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  attachAccessToken,
  awaitTokenRefresh,
  logRequest,
  logResponse,
  tryTokenRefresh,
} from './apiInterceptor';

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

const apiSetting: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 5000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true, // NOTE: 쿠키를 포함한 크로스 도메인 요청을 위해 필요
};

export const api = axios.create(apiSetting);

api.interceptors.request.use(logRequest);
api.interceptors.request.use(attachAccessToken);
api.interceptors.request.use(awaitTokenRefresh);
api.interceptors.response.use(logResponse, tryTokenRefresh);
