export interface WsResponse {
  action: string;
}

export interface Participants {
  sequence: number;
  memberId: number;
  nickname: string;
  imageUrl: string;
}

export interface WsEnterResponse extends WsResponse {
  participantId: number;
  nickname: string;
  imageUrl: string;
  participants: Participants[];
}

export interface WsWriteResponse extends WsResponse {
  action: 'WRITE';
  completedElement: {
    elementId: number;
    imageUrl: string;
    content: string;
    startedAt: string;
    memberId: number;
    nickname: string;
  };
  upcomingElement: {
    elementId: number;
    imageUrl: string;
    content: null;
    startedAt: string;
    memberId: number;
    nickname: string;
  };
}

export interface LetterItemResponse {
  elementId: string;
  imageUrl: string;
  content: string;
  nickname: string;
  elementSequence: number;
  writeSequence: number;
}

export interface WsExitResponse extends WsResponse {
  participantId: number;
  isManager: boolean;
  nickname: string;
}

export interface WsEndResponse {
  letterId: number;
  action: string;
}

export interface WsStartResponse {
  letterId: number;
  action: string;
}
