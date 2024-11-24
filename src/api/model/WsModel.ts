export interface WsEnterResponse {
  participantId: number;
  nickname: string;
  imageUrl: string;
  action: string;
}

export interface WsExitResponse {
  participantId: number;
  nickname: string;
  action: string;
}