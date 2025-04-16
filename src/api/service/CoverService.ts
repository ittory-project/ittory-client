import { api, ApiResponse } from '../config/api';
import { CoverTypeGetResponse } from '../model/CoverType';

// 커버 타입 조회 API
export async function getCoverTypes(): Promise<CoverTypeGetResponse> {
  const response: ApiResponse<CoverTypeGetResponse> =
    await api.get(`/api/cover-type/all`);
  return response.data.data; // 커버 타입 배열 반환
}
