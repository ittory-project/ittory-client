// 편지 시작 시 정보 조회(참여자) Response
export interface LetterStartInfoGetResponse {
  participantCount: number,
  repeatCount: number,
  elementCount: number
}

// 현재 유저를 순서에 맞게 조회 
export interface LetterPartiListGetResponse {
  participants: LetterPartiItem[]
}

// 현재 유저 리스트 아이템
export interface LetterPartiItem {
  sequence: number,
  memberId: number,
  nickname: string,
  imageUrl: string
}