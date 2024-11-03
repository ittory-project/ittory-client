import { api, ApiResponse } from "../config/api";
import { FontAllResponse } from "../model/FontModel";
import { Font } from "../model/FontModel";
import axios from "axios";

export async function getAllFont(): Promise<Font[]> {
  const response: ApiResponse<FontAllResponse> = await api.get(`/api/font/all`);
  return response.data.data;
}

export async function postFont(fname: string): Promise<Font> {
  const response = await api.post("https://dev-server.ittory.co.kr/api/font", {
    name: fname,
  });
  return response.data.data; // 성공적으로 추가된 폰트 데이터 반환
}
