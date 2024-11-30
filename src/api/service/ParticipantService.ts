import { api, ApiResponse } from "../config/api";
import {
  RandomPostRequest,
  RandomPostResponse,
  DuplicateGetResponse,
  NicknamePostRequest,
  NicknamePostResponse,
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

export async function getDuplicate(
  letterId: number,
  nickname: string
): Promise<DuplicateGetResponse> {
  const response: ApiResponse<DuplicateGetResponse> = await api.get(
    `https://dev-server.ittory.co.kr/api/participant/duplicate-nickname?letterId=${letterId}&nickname=${nickname}`
  );
  return response.data.data;
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
