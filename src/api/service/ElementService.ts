import { api, ApiResponse } from '../config/api';
import { ElementImgGetResponse } from '../model/ElementModel';

// 편지 아이템 이미지 불러오기 API
// param: 편지 ID, 편지 순서
// response: ElementImgGetResponse
export async function getElementImg(
  letterId: number,
  sequence: number,
): Promise<ElementImgGetResponse> {
  const response: ApiResponse<ElementImgGetResponse> = await api.get(
    `/api/element/image`,
    {
      params: {
        letterId,
        sequence,
      },
    },
  );
  return response.data.data;
}
