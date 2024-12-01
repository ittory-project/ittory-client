// 특정 커버타입 조회 API Response
export interface CoverTypeGetResponse {
  id: number,
  name: string,
  listImageUrl: string,
  selectImageUrl: string,
  editImageUrl: string,
  confirmImageUrl: string,
  outputBackgroundImageUrl: string,
  loadingBackgroundImageUrl: string,
  outputBoardImageUrl: string,
  listColor: string,
}