// 편지 아이템 이미지 API Response
export interface ElementImgGetResponse {
  elementImageUrl: string;
}

export interface ElementResponse {
  elementId: number;
  imageUrl: string;
  content: string | null;
  startedAt: string | null;
  memberId: number | null;
  nickname: string | null;
}

export interface PagedElements {
  pageNumber: number;
  hasNext: boolean;
  elements: ElementResponse[];
}
