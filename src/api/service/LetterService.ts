import { api, ApiResponse } from "../config/api";
import {
  LetterStartPartiGetResponse,
  LetterPostResponse,
  LetterRequestBody,
  ParticipantsGetResponse,
  LetterDeleteResponse,
  ApiLetterResponse,
  CountRequestBody,
  CountPostResponse,
  LetterInfoGetResponse,
  LetterEnterResponse,
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
  const response = await api.post<ApiLetterResponse<LetterPostResponse>>(
    "https://dev-server.ittory.co.kr/api/letter",
    data
  );
  return response.data.data;
}

//유저 조회 API
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

/*
//편지삭제 api
export async function deleteLetter(
  letterId: number
): Promise<LetterDeleteResponse> {
  const response = await api.delete(
    `https://dev-server.ittory.co.kr/api/letter/${letterId}`
  );

  return response.data;
}*/

//편지 작성 중 편지 삭제되는 API
export const deleteLetter = async (
  letterId: number
): Promise<LetterDeleteResponse> => {
  try {
    const response = await api.delete(
      `https://dev-server.ittory.co.kr/api/letter/${letterId}`
    );

    // 204 No Content 응답 처리 (편지가 정상적으로 삭제되었을 때)
    if (response.status === 204) {
      return;
    }
    return response.data;
  } catch (err) {
    throw err;
  }
};

//반복 횟수 API
export async function postRepeatCount(
  data: CountRequestBody
): Promise<CountPostResponse> {
  const response = await api.post<CountPostResponse>(
    "https://dev-server.ittory.co.kr/api/letter/repeat-count",
    data
  );
  return response.data;
}

//편지 기본 정보 조회 API
export async function getLetterInfo(
  letterId: number
): Promise<LetterInfoGetResponse> {
  const response = await api.get(
    `https://dev-server.ittory.co.kr/api/letter/info/${letterId}`
  );

  return response.data.data;
}

//편지 참여가능 여부 조회
export async function getEnterStatus(
  letterId: number
): Promise<LetterEnterResponse> {
  const response = await api.get(
    `https://dev-server.ittory.co.kr/api/letter/${letterId}/enter-status`
  );

  return response.data.data;
}
