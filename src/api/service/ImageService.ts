import { ApiResponse } from "../config/api";
import { CoverImagePostResponse, ImageUrlRequest } from "../model/ImageModel";
import axios from "axios";

export async function postCoverImage(
  imageUrlRequest: ImageUrlRequest
): Promise<CoverImagePostResponse> {
  try {
    const response: ApiResponse<CoverImagePostResponse> = await axios.post(
      `api/image/letter-cover`,
      imageUrlRequest,
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 설정
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error in postCoverImage:", error);
    throw error;
  }
}
