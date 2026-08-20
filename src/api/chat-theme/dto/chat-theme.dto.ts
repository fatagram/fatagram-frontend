export interface ThemeColorsDto {
  gradient?: string;
  primaryLight?: string;
  primaryMain?: string;
  bgMain?: string;
  bgSecond?: string;
}

export interface ChatThemeDto {
  id: string;
  key: string;
  label: string;
  category: string;
  isDefault: boolean;
  isActive: boolean;
  isEvent: boolean;
  bgImage?: string | null;
  light?: ThemeColorsDto | null;
  dark?: ThemeColorsDto | null;
  startDate?: string | null;
  endDate?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateChatThemeDto {
  key: string;
  label: string;
  category?: string;
  isDefault?: boolean;
  isActive?: boolean;
  isEvent?: boolean;
  bgImage?: string | null;
  light?: ThemeColorsDto | null;
  dark?: ThemeColorsDto | null;
  startDate?: string | null;
  endDate?: string | null;
  sortOrder?: number;
}

export interface UpdateChatThemeDto {
  label: string;
  category?: string;
  isDefault?: boolean;
  isActive?: boolean;
  isEvent?: boolean;
  bgImage?: string | null;
  light?: ThemeColorsDto | null;
  dark?: ThemeColorsDto | null;
  startDate?: string | null;
  endDate?: string | null;
  sortOrder?: number;
}
