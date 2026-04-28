import { buildApiPath } from "../common/api-helpers";
import { apiClient } from "../common/axios-interceptor";
import { GifResponseDto } from "./dto/git.dto";

const PREFIX = buildApiPath("/gifs");

export class GifService {
  async getGifTrending(limit = 20, pos?: string): Promise<GifResponseDto> {
    const response = await apiClient.get<GifResponseDto>(PREFIX + "/trending", {
      params: { limit, pos },
    });
    return response.data;
  }

  async getGifSearch(query: string, limit = 20, pos?: string): Promise<GifResponseDto> {
    const response = await apiClient.get<GifResponseDto>(PREFIX + "/search", {
      params: { query, limit, pos },
    });

    return response.data;
  }
}

export const gifService = new GifService();
