export interface WsEnterResponse {
  participantId: number,
  nickname: string,
  imageUrl: string,
  action: string
}

// redux에도 그대로 사용함
export interface LetterItem {
  elementId: string,
  imageUrl?: string,
  content?: string,
  nickname?: string,
  elementSequence?: number,
  writeSequence?: number,
}

export interface WsExitResponse {
  participantId: number,
  nickname: string,
  action: string // "EXIT"
}