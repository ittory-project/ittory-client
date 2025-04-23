import { ApiResponse, BaseResponse, api } from '../config/api';

// 참여자들의 편지함에 편지 저장 API
// param: 편지 ID
// response: string
export async function postPartiLetterBox(letterId: number): Promise<boolean> {
  const response: ApiResponse<BaseResponse<string>> = await api.post(
    `/api/letter-box/participation`,
    {
      letterId,
    },
  );
  return response.data.success;
}
