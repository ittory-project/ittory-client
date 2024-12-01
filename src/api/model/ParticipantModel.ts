//참여자 작성 순서 설정
export interface RandomPostRequest {
  letterId: number;
}
export interface randomParticipants {
  sequence: number;
  memberId: number;
  nickname: string;
  imageUrl: string;
}

export type RandomPostResponse = randomParticipants[];

//닉네임 설정
export interface NicknamePostRequest {
  nickname: string;
}
export interface NicknamePostResponse {
  isSuccess: boolean;
  nickname: string;
}

export interface NicknamePatchResponse {
  success: boolean;
  status: number;
  code: string;
  message: string;
}
