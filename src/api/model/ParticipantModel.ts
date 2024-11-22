//참여자 작성 순서 설정
export interface RandomPostRequest {
  letterId: string;
}
export interface randomParticipants {
  sequence: number;
  memberId: number;
  nickname: string;
  imageUrl: string;
}

export type RandomPostResponse = randomParticipants[];

//사용자 중복 닉네임 확인
export interface DuplicateGetResponse {
  isDuplicate: boolean;
}
