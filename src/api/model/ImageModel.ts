export interface CoverImagePostResponse {
  preSignedUrl: string;
  key: string;
}

export interface ImageUrlRequest {
  imgExtension: string; // Enum으로 타입을 설정
}
