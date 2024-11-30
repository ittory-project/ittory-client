// 편지 시작 시 정보 조회(참여자) Response
export interface LetterStartInfoGetResponse {
  title: string,
  participantCount: number,
  repeatCount: number,
  elementCount: number
}

// 현재 유저를 순서에 맞게 조회 
export interface LetterPartiListGetResponse {
  participants: LetterPartiItem[]
}

// redux에 저장된 편지 아이템
export interface LetterItem {
  elementId: number,
  content?: string,
  userNickname?: string,
  userId?: number,
  letterImg?: string,
}

// 현재 유저 리스트 아이템
export interface LetterPartiItem {
  sequence: number,
  memberId: number,
  nickname: string,
  imageUrl?: string
}

// 편지 상세 정보 조회 API Response
export interface LetterDetailGetResponse {
  letterId: number,
  coverTypeId: number,
  fontId: number,
  receiverName: string,
  deliveryDate: string,
  title: string,
  coverPhotoUrl: string,
  elements: LetterDetail[]
}

// 편지 상세 정보 요소 아이템
export interface LetterDetail {
  id: number,
  nickname: string,
  coverImageUrl: string,
  content: string,
  sequence: number
}

// 편지가 저장 가능한지 확인하는 API Response
export interface LetterStorageCheckGetResponse {
  isStored: boolean,
  receiverName: string
}
