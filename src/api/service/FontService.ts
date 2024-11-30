import { api, ApiResponse } from "../config/api";
import { FontAllResponse } from "../model/FontModel";
import { Font } from "../model/FontModel";

export async function getAllFont(): Promise<Font[]> {
  const response: ApiResponse<FontAllResponse> = await api.get(`/api/font/all`);
  return response.data.data;
}
