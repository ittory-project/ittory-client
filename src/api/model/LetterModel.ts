// 편지 시작 시 정보 조회(참여자) Response
export interface LetterStartPartiGetResponse {
  participantCount: number;
  repeatCount: number;
  elementCount: number;
}

//편지 작성 POST
export interface LetterRequestBody {
  coverTypeId: number;
  fontId: number;
  receiverName: string;
  deliveryDate: string;
  title: string;
  coverPhotoUrl: string;
}
export interface ApiLetterResponse<T> {
  success: boolean;
  status: number;
  data: T; // 실제 데이터는 data 속성 안에 있습니다.
}

// 기존 LetterPostResponse 타입 정의는 그대로
export interface LetterPostResponse {
  coverPhotoUrl: string;
  coverTypeId: number;
  createdAt: string;
  deliveryDate: string;
  fontId: number;
  letterId: number;
  receiverName: string;
  title: string;
  updatedAt: string;
}

//유저 조회
export interface Participants {
  sequence: number;
  memberId: number;
  nickname: string;
  imageUrl: string;
}

export type ParticipantsGetResponse = Participants[];

// 편지 삭제
export type LetterDeleteResponse = void;
