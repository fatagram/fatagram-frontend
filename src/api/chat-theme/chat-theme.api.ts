import { Result } from "@/api/common/result";
import { buildApiPath, apiGet, apiPost, apiPut, apiPatch, apiDelete } from "../common/api-helpers";
import { ChatThemeDto, CreateChatThemeDto, UpdateChatThemeDto } from "./dto/chat-theme.dto";

const USER_PREFIX = buildApiPath("/chat-themes");
const ADMIN_PREFIX = buildApiPath("/admin/chat-themes");

export class ChatThemeService {
  // Client APIs
  public async getActiveThemes(): Promise<Result<ChatThemeDto[]>> {
    return await apiGet<ChatThemeDto[]>(`${USER_PREFIX}`);
  }

  public async getThemeByKey(key: string): Promise<Result<ChatThemeDto>> {
    return await apiGet<ChatThemeDto>(`${USER_PREFIX}/${key}`);
  }

  // Admin APIs
  public async getAllThemesForAdmin(): Promise<Result<ChatThemeDto[]>> {
    return await apiGet<ChatThemeDto[]>(`${ADMIN_PREFIX}`);
  }

  public async getThemeByIdForAdmin(id: string): Promise<Result<ChatThemeDto>> {
    return await apiGet<ChatThemeDto>(`${ADMIN_PREFIX}/${id}`);
  }

  public async createTheme(dto: CreateChatThemeDto): Promise<Result<ChatThemeDto>> {
    return await apiPost<ChatThemeDto>(`${ADMIN_PREFIX}`, dto);
  }

  public async updateTheme(id: string, dto: UpdateChatThemeDto): Promise<Result<ChatThemeDto>> {
    return await apiPut<ChatThemeDto>(`${ADMIN_PREFIX}/${id}`, dto);
  }

  public async toggleThemeStatus(id: string): Promise<Result<ChatThemeDto>> {
    return await apiPatch<ChatThemeDto>(`${ADMIN_PREFIX}/${id}/toggle`);
  }

  public async deleteTheme(id: string): Promise<Result<void>> {
    return await apiDelete<void>(`${ADMIN_PREFIX}/${id}`);
  }
}

export const chatThemeService = new ChatThemeService();
