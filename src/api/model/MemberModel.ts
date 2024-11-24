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
    letters: ReceiveLetterModel[];
  };
}

//참여한 편지함 조회
export interface ParticipationGetResponse {
  success: boolean;
  status: number;
  data: {
    letters: ParticipateLetterModel[];
  };
}

export interface ParticipateLetterModel {
  letterId: number;
  receiverName: string;
  coverTypeImage: string;
  deliveryDate: string;
}

export interface ReceiveLetterModel {
  letterId: number;
  title: string;
  coverTypeImage: string;
  deliveryDate: string;
}

//재방문 유저 확인
export interface VisitGetResponse {
  isVisited: boolean;
}

//편지함에서 편지 삭제(리스트에서)
export interface  LetterboxDeleteResponse{
  success: boolean;
  status: number;
}