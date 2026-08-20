import { useQueryClient } from "@tanstack/react-query";
import { Result } from "@/api/common/result";
import { chatThemeService } from "@/api/chat-theme/chat-theme.api";
import {
  ChatThemeDto,
  CreateChatThemeDto,
  UpdateChatThemeDto,
} from "@/api/chat-theme/dto/chat-theme.dto";
import { useSafeQueryResult } from "@/hooks/use-safe-query";
import { useResultFetcher } from "@/hooks/use-fetcher";
import { useSnackbar } from "@/contexts/snackbar-context";
import { useTranslation } from "react-i18next";

export const CHAT_THEME_KEYS = {
  active: ["chat-themes", "active"] as const,
  byKey: (key: string) => ["chat-themes", "key", key] as const,
  adminList: ["admin", "chat-themes"] as const,
  detail: (id: string) => ["admin", "chat-themes", id] as const,
};

export const useGetActiveChatThemes = () => {
  return useSafeQueryResult<ChatThemeDto[]>({
    queryKey: CHAT_THEME_KEYS.active,
    fn: async () => await chatThemeService.getActiveThemes(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useGetChatThemeByKey = (themeKey?: string | null) => {
  const cleanKey = themeKey && themeKey !== "default" ? themeKey : null;
  return useSafeQueryResult<ChatThemeDto | null>({
    queryKey: CHAT_THEME_KEYS.byKey(cleanKey || ""),
    fn: async (): Promise<Result<ChatThemeDto | null>> => {
      if (!cleanKey) return { success: true, data: null };
      return await chatThemeService.getThemeByKey(cleanKey);
    },
    enabled: Boolean(cleanKey),
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};

export const useAdminChatThemes = () => {
  return useSafeQueryResult<ChatThemeDto[]>({
    queryKey: CHAT_THEME_KEYS.adminList,
    fn: async () => await chatThemeService.getAllThemesForAdmin(),
    staleTime: 60 * 1000,
  });
};

export const useCreateChatTheme = (options?: { onSuccess?: (data: ChatThemeDto) => void }) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  return useResultFetcher(
    async (dto: CreateChatThemeDto) => await chatThemeService.createTheme(dto),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: CHAT_THEME_KEYS.adminList });
        queryClient.invalidateQueries({ queryKey: CHAT_THEME_KEYS.active });
        showSnackbar(
          t("common:admin.themes.createSuccess", "Tạo theme thành công"),
          "success",
        );
        if (data) {
          options?.onSuccess?.(data);
        }
      },
      onError: (err) => {
        showSnackbar(
          err?.detail || err?.code || t("common:admin.themes.createError", "Lỗi khi tạo theme"),
          "error",
        );
      },
    },
  );
};

export const useUpdateChatTheme = (options?: { onSuccess?: (data: ChatThemeDto) => void }) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  return useResultFetcher(
    async ({ id, dto }: { id: string; dto: UpdateChatThemeDto }) =>
      await chatThemeService.updateTheme(id, dto),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: CHAT_THEME_KEYS.adminList });
        queryClient.invalidateQueries({ queryKey: CHAT_THEME_KEYS.active });
        showSnackbar(
          t("common:admin.themes.updateSuccess", "Cập nhật theme thành công"),
          "success",
        );
        if (data) {
          options?.onSuccess?.(data);
        }
      },
      onError: (err) => {
        showSnackbar(
          err?.detail || err?.code || t("common:admin.themes.updateError", "Lỗi khi cập nhật theme"),
          "error",
        );
      },
    },
  );
};

export const useToggleChatThemeStatus = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  return useResultFetcher(
    async (id: string) => await chatThemeService.toggleThemeStatus(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: CHAT_THEME_KEYS.adminList });
        queryClient.invalidateQueries({ queryKey: CHAT_THEME_KEYS.active });
        showSnackbar(
          data?.isActive
            ? t("common:admin.themes.activated", "Đã kích hoạt theme")
            : t("common:admin.themes.deactivated", "Đã ẩn theme"),
          "success",
        );
      },
      onError: (err) => {
        showSnackbar(
          err?.detail || err?.code || t("common:admin.themes.toggleError", "Lỗi khi đổi trạng thái theme"),
          "error",
        );
      },
    },
  );
};

export const useDeleteChatTheme = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  return useResultFetcher(
    async (id: string) => await chatThemeService.deleteTheme(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: CHAT_THEME_KEYS.adminList });
        queryClient.invalidateQueries({ queryKey: CHAT_THEME_KEYS.active });
        showSnackbar(
          t("common:admin.themes.deleteSuccess", "Đã xóa theme thành công"),
          "success",
        );
        options?.onSuccess?.();
      },
      onError: (err) => {
        showSnackbar(
          err?.detail || err?.code || t("common:admin.themes.deleteError", "Lỗi khi xóa theme"),
          "error",
        );
      },
    },
  );
};

