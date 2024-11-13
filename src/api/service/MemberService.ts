import { api, ApiResponse } from "../config/api";
import {
  LetterCountsGetResponse,
  MypageGetResponse,
  WithdrawPostResponse,
  WithdrawPostRequest,
  ReceivedGetResponse,
  ParticipationGetResponse,
  VisitGetResponse,
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

export async function getReceivedLetter(): Promise<ReceivedGetResponse> {
  const response = await api.get<ReceivedGetResponse>(
    "https://dev-server.ittory.co.kr/api/member/received"
  );
  return response.data;
}

export async function getParticipatedLetter(): Promise<ParticipationGetResponse> {
  const response = await api.get<ReceivedGetResponse>(
    "https://dev-server.ittory.co.kr/api/member/participations"
  );
  return response.data;
}

//재방문 유저 확인
export async function getVisitUser(): Promise<VisitGetResponse> {
  const response: ApiResponse<VisitGetResponse> = await api.get(
    "https://dev-server.ittory.co.kr/api/member/visit"
  );
  return response.data.data;
}
