export interface Font {
  id: number;
  name: string;
  value: string;
}

export type FontAllResponse = Font[];

// 특정 커버타입 조회 API Response
export interface FontGetResponse {
  id: number;
  name: string;
  value: string;
}
