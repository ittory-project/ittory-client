import { api, ApiResponse } from "../config/api";
import { LetterDetailGetResponse, LetterPartiListGetResponse, LetterStartInfoGetResponse } from "../model/LetterModel";

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
export async function getLetterPartiList(letterId: number): Promise<LetterPartiListGetResponse> {
  const response: ApiResponse<LetterPartiListGetResponse> = await api.get( 
    `/api/letter/participant/${letterId}`, {
      params: {
        order: 'sequence'
      }
    });
  return response.data.data;
}

// 편지 내용 상세 조회 API
// param: 편지 ID
// response: ShareDetailGetResponse
export async function getLetterDetailInfo(letterId: number): Promise<LetterDetailGetResponse> {
  const response: ApiResponse<LetterDetailGetResponse> = await api.get( 
    `/api/letter/detail/${letterId}`);
  return response.data.data;
}
