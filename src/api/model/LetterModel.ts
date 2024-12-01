// 편지 시작 시 정보 조회(참여자) Response
export interface LetterStartInfoGetResponse {
  title: string;
  participantCount: number;
  repeatCount: number;
  elementCount: number;
}

// 현재 유저를 순서에 맞게 조회
export interface LetterPartiListGetResponse {
  participants: LetterPartiItem[];
}

// redux에 저장된 편지 아이템
export interface LetterItem {
  elementId: number;
  content?: string;
  userNickname?: string;
  userId?: number;
  letterImg?: string;
}

// 현재 유저 리스트 아이템
export interface LetterPartiItem {
  sequence: number;
  memberId: number;
  nickname: string;
  imageUrl?: string;
}
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
  data: T;
}
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

//편지 반복 횟수 등록
export interface CountRequestBody {
  letterId: number;
  repeatCount: number;
}

export interface CountPostResponse {
  success: boolean;
  status: number;
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
export type LetterDeleteResponse = void | {
  success: boolean;
  status: number;
  code: string;
  message: string;
  info: number;
};

//편지 기본 정보 조회
export interface LetterInfoGetResponse {
  coverPhotoUrl: string;
  coverTypeId: number;
  deliveryDate: string;
  fontId: number;
  letterId: number;
  receiverName: string;
  title: string;
}

//편지 참여 요청
export interface LetterEnterResponse {
  enterStatus: boolean;
  participantId: number;
}
