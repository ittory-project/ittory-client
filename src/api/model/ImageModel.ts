import { ImageExtension } from '../../components/createPage/CoverDeco/ImageCropper';

export interface CoverImagePostResponse {
  preSignedUrl: string;
  key: string;
}

export interface ImageUrlRequest {
  imgExtension: ImageExtension; // Enum으로 타입을 설정
}
