import { ApiResponse, api } from '../config/api';
import { CoverImagePostResponse, ImageUrlRequest } from '../model/ImageModel';

export async function postCoverImage(
  imageUrlRequest: ImageUrlRequest,
): Promise<CoverImagePostResponse> {
  const response: ApiResponse<CoverImagePostResponse> = await api.post(
    `api/image/letter-cover`,
    imageUrlRequest,
    {
      headers: {
        'Content-Type': 'application/json', // JSON 형식으로 설정
      },
    },
  );
  return response.data.data;
}
