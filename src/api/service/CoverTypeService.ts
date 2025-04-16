import { api, ApiResponse } from '../config/api';
import { CoverTypeGetResponse } from '../model/CoverTypeModel';

// 특정 커버타입 이름 조회 API
// param: 커버타입 ID
// response: CoverTypeGetResponse
export async function getCoverTypeById(
  coverTypeId: number,
): Promise<CoverTypeGetResponse> {
  const response: ApiResponse<CoverTypeGetResponse> = await api.get(
    `/api/cover-type/${coverTypeId}`,
  );
  return response.data.data;
}
