import { api, ApiResponse } from "../config/api";
import { LetterPartiListGetResponse, LetterStartInfoGetResponse } from "../model/LetterModel";

// 편지 시작 시 정보 조회 API
// param: 편지 ID
// response: LetterStartInfoGetResponse
export async function getLetterStartInfo(letterId: number): Promise<LetterStartInfoGetResponse> {
  const response: ApiResponse<LetterStartInfoGetResponse> = await api.get( 
    `/api/letter/${letterId}/startInfo`);
  return response.data.data;
}

// 현재 유저를 순서에 맞게 조회 API
// param: 편지 ID, 순서
// response: LetterPartiListGetResponse
export async function getLetterPartiList(letterId: number, order?: number): Promise<LetterPartiListGetResponse> {
  const response: ApiResponse<LetterPartiListGetResponse> = await api.get( 
    `/api/letter/participant/${letterId}`, {
      params: {
        order
      }
    });
  console.log(response)
  return response.data.data;
}