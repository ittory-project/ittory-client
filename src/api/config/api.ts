import axios, { AxiosResponse } from 'axios';
import { getJwt } from './setToken';
import { awaitTokenRefresh, tryTokenRefrsh } from './tokenRefresh';

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

export const api = axios.create(apiSetting);

// localStorage에서 Access Token 불러옴
// TODO: localStorage 방식 제거 시 함께 제거
api.defaults.headers.common['Authorization'] = `Bearer ${getJwt()}`;

api.interceptors.request.use(awaitTokenRefresh);
api.interceptors.response.use(null, tryTokenRefrsh);
