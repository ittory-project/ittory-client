import axios, { AxiosError, AxiosResponse } from "axios"
import { getJwt } from "./setToken"

export interface BaseResponse<T> {
  success: boolean
  status: number
  data: T
}

export interface BaseError{
  success: boolean
  status: number
  code: string
  message: string
  info?: string
}

export type ApiResponse<T> = AxiosResponse<BaseResponse<T>>

const apiSetting = {
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 5000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
}

// const setAxiosJwtHeader = (config: { headers: any }) => {
//   const jwt = getJwt()
//   if (jwt) {
//     api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
//   } else {
//       delete api.defaults.headers.common['Authorization'];
//   }
//   return config
// }

const setAxiosJwtHeader = (config: { headers: any }) => {
  const jwt = getJwt();
  if (jwt) {
    config.headers['Authorization'] = `Bearer ${jwt}`;
  } else {
    delete config.headers['Authorization'];
  }
  return config;
};

const responseHandler = (response: AxiosResponse): Promise<AxiosResponse> => {
  if (!response.data.isSuccess) {
    console.error(response)
    window.alert(`오류: ${response.data.message}`)
    return Promise.reject(new AxiosError)
  }
  return Promise.resolve(response)
}
  
const errorHandler = (error: AxiosError<BaseResponse<any>> | Error): Promise<AxiosError> => {
  if (axios.isAxiosError(error)) {
    console.error(`${error}\n${error.config?.method}: ${error.config?.url}`)
    if (error.response?.status === 400 && error.response && error.response.data.message) {
      alert(`${error.response.data.message}`)
      console.error(error.response.data)
    } else {
      alert(`서버 연결에 실패하였습니다.`)
    }
  } else {
    console.error(`${error}`)
    alert(`서버 연결에 실패하였습니다.`)
  }

  return Promise.reject(error)
}

export const api = axios.create(apiSetting)
api.interceptors.request.use(setAxiosJwtHeader)
api.interceptors.response.use(responseHandler, errorHandler)