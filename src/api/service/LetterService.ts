import { api, ApiResponse } from "../config/api";
import {
  LetterStartPartiGetResponse,
  LetterPostResponse,
  LetterRequestBody,
  ParticipantsGetResponse,
  LetterDeleteResponse,
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

//유저 조회 api
export async function getParticipants(
  letterId: number,
  order?: string
): Promise<ParticipantsGetResponse> {
  const params: Record<string, any> = {};

  if (order) {
    params.order = order; // `order`가 있으면 추가
  }

  const response = await api.get<{
    data: {
      participants: ParticipantsGetResponse;
    };
  }>(`https://dev-server.ittory.co.kr/api/letter/participant/${letterId}`, {
    params,
  });

  return response.data.data.participants;
}

//편지삭제 api
export async function deleteLetterLetter(
  letterId: number
): Promise<LetterDeleteResponse> {
  const response = await api.delete(
    `https://dev-server.ittory.co.kr/api/letter/${letterId}`
  );

  return response.data;
}
