import { api, ApiResponse } from "../config/api";
import {
  LetterStartPartiGetResponse,
  LetterPostResponse,
  LetterRequestBody,
} from "../model/LetterModel";

// 편지 시작 시 정보 조회 API
// param: 편지 ID
// response: LoginJwtPostResponse - 서버의 토큰
export async function getLetterStartParti(
  letterId: number
): Promise<LetterStartPartiGetResponse> {
  const response: ApiResponse<LetterStartPartiGetResponse> = await api.get(
    `/api/letter/${letterId}/startInfo`
  );
  return response.data.data;
}

//편지 작성 POST API (편지 생성 마지막)
export async function postLetter(
  data: LetterRequestBody
): Promise<LetterPostResponse> {
  const response = await api.post<LetterPostResponse>(
    "https://dev-server.ittory.co.kr/api/letter",
    data
  );
  return response.data;
}
