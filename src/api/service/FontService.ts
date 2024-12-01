import { api, ApiResponse } from "../config/api";
import { FontGetResponse } from "../model/FontModel";

// 특정 폰트 이름 조회 API
// param: 폰트 ID
// response: FontGetResponse
export async function getFontById(fontId: number): Promise<FontGetResponse> {
  const response: ApiResponse<FontGetResponse> = await api.get( 
    `/api/font/${fontId}`);
  return response.data.data;
}
