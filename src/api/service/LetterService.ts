import { ApiResponse, BaseResponse, api } from '../config/api';
import {
  ApiLetterResponse,
  CountPostResponse,
  CountRequestBody,
  LetterDetailGetResponse,
  LetterEnterResponse,
  LetterInfoGetResponse,
  LetterPartiListGetResponse,
  LetterPostResponse,
  LetterRequestBody,
  LetterStartInfoGetResponse,
  LetterStorageCheckGetResponse,
  ParticipantsGetResponse,
  PostEnterRequestBody,
} from '../model/LetterModel';

// 편지 시작 시 정보 조회 API
// param: 편지 ID
// response: LetterStartInfoGetResponse
export async function getLetterStartInfo(
  letterId: number,
): Promise<LetterStartInfoGetResponse> {
  const response: ApiResponse<LetterStartInfoGetResponse> = await api.get(
    `/api/letter/${letterId}/startInfo`,
  );
  return response.data.data;
}

// 현재 유저를 순서에 맞게 조회 API
// param: 편지 ID, 순서
// response: LetterPartiListGetResponse
export async function getLetterPartiList(
  letterId: number,
  order?: string,
): Promise<LetterPartiListGetResponse> {
  const response: ApiResponse<LetterPartiListGetResponse> = await api.get(
    `/api/letter/participant/${letterId}`,
    {
      params: {
        order,
      },
    },
  );
  return response.data.data;
}

//편지 작성 POST API (편지 생성 마지막)
export async function postLetter(
  data: LetterRequestBody,
): Promise<LetterPostResponse> {
  const response = await api.post<ApiLetterResponse<LetterPostResponse>>(
    `/api/letter`,
    data,
  );
  return response.data.data;
}

//유저 조회 API
export async function getParticipants(
  letterId: number,
  order?: string,
): Promise<ParticipantsGetResponse> {
  const params: Record<string, unknown> = {};

  if (order) {
    params.order = order; // `order`가 있으면 추가
  }

  const response = await api.get<{
    data: {
      participants: ParticipantsGetResponse;
    };
  }>(`api/letter/participant/${letterId}`, {
    params,
  });

  return response.data.data.participants;
}

// 편지 삭제 API
export function deleteLetter(letterId: number) {
  return api.delete(`api/letter/${letterId}`);
}

//반복 횟수 API
export async function postRepeatCount(
  data: CountRequestBody,
): Promise<CountPostResponse> {
  const response = await api.post<CountPostResponse>(
    `api/letter/repeat-count`,
    data,
  );
  return response.data;
}

//편지 기본 정보 조회 API
export async function getLetterInfo(
  letterId: number,
): Promise<LetterInfoGetResponse> {
  const response = await api.get(`api/letter/info/${letterId}`);

  return response.data.data;
}

//편지 참여 요청
export async function postEnter(
  letterId: number,
  nickname: PostEnterRequestBody,
): Promise<LetterEnterResponse> {
  const response = await api.post(`api/letter/enter/${letterId}`, nickname);
  return response.data.data;
}

// 편지 내용 상세 조회 API
// param: 편지 ID
// response: ShareDetailGetResponse
export async function getLetterDetailInfo(
  letterId: number,
): Promise<LetterDetailGetResponse> {
  const response: ApiResponse<LetterDetailGetResponse> = await api.get(
    `/api/letter/detail/${letterId}`,
  );
  return response.data.data;
}

// 편지가 저장 가능한지 확인 API
// param: 편지 ID
// response: LetterStorageCheckGetResponse - isStored가 false면 저장 가능
export async function getLetterStorageCheck(
  letterId: number,
): Promise<LetterStorageCheckGetResponse> {
  const response: ApiResponse<LetterStorageCheckGetResponse> = await api.get(
    `/api/letter/${letterId}/storage-status`,
  );
  return response.data.data;
}

// 편지를 보관함에 저장 API
// param: 편지 ID
// response: string
export async function postLetterStore(
  letterId: number,
): Promise<BaseResponse<string>> {
  const response: ApiResponse<BaseResponse<string>> = await api.post(
    `/api/letter/${letterId}/store`,
  );
  return response.data.data;
}
