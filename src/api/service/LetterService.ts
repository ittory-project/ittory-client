import { api, ApiResponse } from "../config/api";
import {
  LetterPostResponse,
  LetterRequestBody,
  ParticipantsGetResponse,
  LetterDeleteResponse,
  ApiLetterResponse,
  CountRequestBody,
  CountPostResponse,
  LetterInfoGetResponse,
  LetterEnterResponse,
  LetterPartiListGetResponse,
  LetterStartInfoGetResponse,
} from "../model/LetterModel";

// 편지 시작 시 정보 조회 API
// param: 편지 ID
// response: LetterStartInfoGetResponse
export async function getLetterStartInfo(
  letterId: number
): Promise<LetterStartInfoGetResponse> {
  const response: ApiResponse<LetterStartInfoGetResponse> = await api.get(
    `/api/letter/${letterId}/startInfo`
  );
  return response.data.data;
}

// 현재 유저를 순서에 맞게 조회 API
// param: 편지 ID, 순서
// response: LetterPartiListGetResponse
export async function getLetterPartiList(
  letterId: number
): Promise<LetterPartiListGetResponse> {
  const response: ApiResponse<LetterPartiListGetResponse> = await api.get(
    `/api/letter/participant/${letterId}`,
    {
      params: {
        order: "sequence",
      },
    }
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

//편지 삭제 API
/*
export async function deleteLetter(
  letterId: number
): Promise<LetterDeleteResponse> {
  try {
    const response = await api.delete(
      `https://dev-server.ittory.co.kr/api/letter/${letterId}`
    );
    return response.data;
  } catch (err: any) {
    if (err.response && err.response.data) {
      console.error("API Error Response:", err.response.data);
      throw err.response.data; // 에러 데이터를 그대로 throw
    } else {
      throw err; // 예기치 않은 에러 처리
    }
  }
}*/
// 편지 삭제 API
export function deleteLetter(
  letterId: number,
  onSuccess: (data: LetterDeleteResponse) => void,
  onError: (error: any) => void
): void {
  api
    .delete(`https://dev-server.ittory.co.kr/api/letter/${letterId}`)
    .then((response) => {
      onSuccess(response.data); // 성공 콜백 호출
    })
    .catch((err) => {
      if (err.response && err.response.data) {
        console.error("API Error Response:", err.response.data);
        onError(err.response.data); // 에러 데이터 콜백 호출
      } else {
        onError(err); // 예기치 않은 에러 콜백 호출
      }
    });
}

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
