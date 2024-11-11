//사용자 각 편지함의 편지수 조회
export interface LetterCountsGetResponse {
  participationLetterCount: number;
  receiveLetterCount: number;
}

//마이페이지 정보 조회
export interface MypageGetResponse {
  memberId: number;
  name: "string";
  profileImage: "string";
  memberStatus: "string";
}

//회원 탈퇴
export interface WithdrawPostRequest {
  withdrawReason: string;
  content: string;
}
export interface WithdrawPostResponse {
  success: boolean;
  status: number;
}

//받은 편지함 조회
export interface ReceivedGetResponse {
  success: boolean;
  status: number;
  data: {
    letters: Letter[];
  };
}

//참여한 편지함 조회
export interface ParticipationGetResponse {
  success: boolean;
  status: number;
  data: {
    letters: Letter[];
  };
}

export interface Letter {
  // 아직 내부 모르는 상태(임의 설정)
  id: number;
  title: string;
}
