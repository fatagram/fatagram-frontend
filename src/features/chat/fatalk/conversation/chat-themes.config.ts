import { ChatThemeDto } from "@/api/chat-theme/dto/chat-theme.dto";

export const DEFAULT_CHAT_THEME: ChatThemeDto = {
  id: "default",
  key: "default",
  label: "Mặc định",
  category: "General",
  isDefault: true,
  isActive: true,
  isEvent: false,
  sortOrder: 0,
};

export const fallbackChatThemes: ChatThemeDto[] = [DEFAULT_CHAT_THEME];

// Deprecated alias for backwards compatibility if needed
export const themeDetails = fallbackChatThemes;
