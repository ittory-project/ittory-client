export interface Participants {
  sequence: number;
  memberId: number;
  nickname: string;
  imageUrl: string;
}

export interface WsEnterResponse {
  participantId: number;
  nickname: string;
  imageUrl: string;
  action: string;
  participants: Participants[];
}

export interface LetterItemResponse {
  elementId: string;
  imageUrl: string;
  content: string;
  nickname: string;
  elementSequence: number;
  writeSequence: number;
}

export interface WsExitResponse {
  participantId: number;
  nickname: string;
  action: string; // "EXIT"
  isManager: boolean;
}

export interface WsEndResponse {
  letterId: number;
  action: string;
}

export interface WsStartResponse {
  letterId: number;
  action: string;
}
