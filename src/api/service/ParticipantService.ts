import { api, BaseResponse } from "../config/api";
import {
  RandomPostRequest,
  RandomPostResponse,
  NicknamePostRequest,
  NicknamePostResponse,
  NicknamePatchResponse,
} from "../model/ParticipantModel";

export async function postRandom(
  data: RandomPostRequest,
): Promise<RandomPostResponse> {
  const response = await api.post<RandomPostResponse>(
    `api/participant/random`,
    data,
  );
  return response.data;
}

export async function postNickname(
  data: NicknamePostRequest,
  letterId: number,
): Promise<NicknamePostResponse> {
  try {
    const response = await api.post<BaseResponse<NicknamePostResponse>>(
      `api/participant/nickname/${letterId}`,
      data,
    );
    return response.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

//닉네임 삭제
export async function patchNickname(
  letterId: number,
): Promise<NicknamePatchResponse> {
  const response = await api.patch<NicknamePatchResponse>(
    `api/participant/nickname/${letterId}`,
  );
  return response.data;
}
