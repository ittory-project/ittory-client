import { api, ApiResponse, BaseResponse } from "../config/api";
import { LetterDetailGetResponse, LetterPartiListGetResponse, LetterStartInfoGetResponse, LetterStorageCheckGetResponse } from "../model/LetterModel";

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

// 편지가 저장 가능한지 확인 API
// param: 편지 ID
// response: LetterStorageCheckGetResponse - isStored가 false면 저장 가능
export async function getLetterStorageCheck(letterId: number): Promise<LetterStorageCheckGetResponse> {
  const response: ApiResponse<LetterStorageCheckGetResponse> = await api.get( 
    `/api/letter/${letterId}/storage-status`);
  return response.data.data;
}

// 편지를 보관함에 저장 API
// param: 편지 ID
// response: string
export async function postLetterStore(letterId: number): Promise<BaseResponse<string>> {
  const response: ApiResponse<BaseResponse<string>> = await api.post( 
    `/api/letter/${letterId}/store`);
  return response.data.data;
}
