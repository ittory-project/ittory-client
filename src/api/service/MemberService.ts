import { api, ApiResponse } from "../config/api";
import {
  LetterCountsGetResponse,
  MypageGetResponse,
  WithdrawPostResponse,
  WithdrawPostRequest,
  ReceivedGetResponse,
  ParticipationGetResponse,
} from "../model/MemberModel";

export async function getLetterCounts(): Promise<LetterCountsGetResponse> {
  const response: ApiResponse<LetterCountsGetResponse> = await api.get(
    "https://dev-server.ittory.co.kr/api/member/letter-counts"
  );
  return response.data.data;
}

export async function getMyPage(): Promise<MypageGetResponse> {
  const response: ApiResponse<MypageGetResponse> = await api.get(
    "https://dev-server.ittory.co.kr/api/member/mypage"
  );
  return response.data.data;
}

export async function postWithdraw(
  data: WithdrawPostRequest
): Promise<WithdrawPostResponse> {
  const response = await api.post<WithdrawPostResponse>(
    "https://dev-server.ittory.co.kr/api/member/withdraw",
    data
  );
  return response.data;
}

export async function getReceivedLetter(
  memberId: number
): Promise<ReceivedGetResponse> {
  const response = await api.get<ReceivedGetResponse>(
    "https://dev-server.ittory.co.kr/api/member/received",
    {
      params: {
        memberId: memberId,
      },
    }
  );
  return response.data;
}

export async function getParticipatedLetter(
  memberId: number
): Promise<ParticipationGetResponse> {
  const response = await api.get<ReceivedGetResponse>(
    "https://dev-server.ittory.co.kr/api/member/participations",
    {
      params: {
        memberId: memberId,
      },
    }
  );
  return response.data;
}
