import { api, ApiResponse } from "../config/api";
import {
  RandomPostRequest,
  RandomPostResponse,
  NicknamePostRequest,
  NicknamePostResponse,
  NicknamePatchResponse,
} from "../model/ParticipantModel";

export async function postRandom(
  data: RandomPostRequest
): Promise<RandomPostResponse> {
  const response = await api.post<RandomPostResponse>(
    "https://dev-server.ittory.co.kr/api/participant/random",
    data
  );
  return response.data;
}

export async function postNickname(
  data: NicknamePostRequest,
  letterId: number
): Promise<NicknamePostResponse> {
  const response = await api.post<NicknamePostResponse>(
    `https://dev-server.ittory.co.kr/api/participant/nickname/${letterId}`,
    data
  );
  return response.data;
}

//닉네임 삭제
export async function patchNickname(
  letterId: number
): Promise<NicknamePatchResponse> {
  const response = await api.patch<NicknamePatchResponse>(
    `https://dev-server.ittory.co.kr/api/participant/nickname/${letterId}`
  );
  return response.data;
}
