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
export interface LetterPostResponse {
  letterId: number;
  coverTypeId: number;
  fontId: number;
  receiverName: string;
  deliveryDate: string;
  title: string;
  coverPhotoUrl: string;
  createdAt: string;
  updatedAt: string;
}
