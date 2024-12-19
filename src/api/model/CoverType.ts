export interface CoverType {
  notSelectImageUrl: string;
  id: number;
  name: string;
  listImageUrl: string;
  selectImageUrl: string;
  editImageUrl: string;
  confirmImageUrl: string;
  outputBackgroundImageUrl: string;
  loadingBackgroundImageUrl: string;
}

export type CoverTypeGetResponse = CoverType[];
