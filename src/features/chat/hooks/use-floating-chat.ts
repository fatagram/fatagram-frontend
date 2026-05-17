import { ChatMeta } from "@/types/chat-meta";
import { create } from "zustand";

const CHAT_STORAGE_KEY = "fawe_open_chats";

interface ChatWindowState {
  focusOnId: string | null;
  activeIds: string[];
  minimizedIds: string[];
  registry: Record<string, ChatMeta>;
  openChat: (id: string, meta: ChatMeta) => void;
  closeChat: (id: string) => void;
  toggleMinimize: (id: string) => void;
  replaceChat: (oldId: string, newId: string) => void;
  reset?: () => void;
  initializeFromStorage?: () => void;
  setFocusOn: (id: string | null) => void;
}

const saveToStorage = (
  activeIds: string[],
  minimizedIds: string[],
  registry: Record<string, ChatMeta>,
) => {
  try {
    const nonTempChats = activeIds.filter((id) => {
      const meta = registry[id];
      return meta?.type !== "temp";
    });

    const nonTempMinimized = minimizedIds.filter((id) => {
      const meta = registry[id];
      return meta?.type !== "temp";
    });

    const nonTempRegistry: Record<string, ChatMeta> = {};
    [...nonTempChats, ...nonTempMinimized].forEach((id) => {
      nonTempRegistry[id] = registry[id];
    });

    localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify({
        activeIds: nonTempChats,
        minimizedIds: nonTempMinimized,
        registry: nonTempRegistry,
      }),
    );
  } catch (e) {
    console.error("Failed to save chats to localStorage:", e);
  }
};

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        activeIds: data.activeIds || [],
        minimizedIds: data.minimizedIds || [],
        registry: data.registry || {},
      };
    }
  } catch (e) {
    console.error("Failed to load chats from localStorage:", e);
  }
  return { activeIds: [], minimizedIds: [], registry: {} };
};

export const useChatStore = create<ChatWindowState>((set) => ({
  focusOnId: null,
  activeIds: [],
  minimizedIds: [],
  registry: {},
  initializeFromStorage: () => {
    const { activeIds, minimizedIds, registry } = loadFromStorage();
    set({
      activeIds,
      minimizedIds,
      registry,
    });
  },
  openChat: (id: string, meta: ChatMeta) =>
    set((state) => {
      if (state.activeIds.includes(id)) return state;
      let newActiveIds = [id, ...state.activeIds];
      let newMinimizedIds = state.minimizedIds.filter((mid) => mid !== id);

      if (newActiveIds.length > 3) {
        const lastId = newActiveIds.pop();
        if (lastId && !newMinimizedIds.includes(lastId)) {
          newMinimizedIds = [lastId, ...newMinimizedIds];
        }
      }

      const newRegistry = { ...state.registry };
      if (meta) {
        newRegistry[id] = meta;
      }

      saveToStorage(newActiveIds, newMinimizedIds, newRegistry);

      return {
        activeIds: newActiveIds,
        minimizedIds: newMinimizedIds,
        registry: newRegistry,
      };
    }),
  closeChat: (id: string) =>
    set((state) => {
      const newActiveIds = state.activeIds.filter((activeId) => activeId !== id);
      const newMinimizedIds = state.minimizedIds.filter((minimizedId) => minimizedId !== id);
      saveToStorage(newActiveIds, newMinimizedIds, state.registry);
      return {
        activeIds: newActiveIds,
        minimizedIds: newMinimizedIds,
      };
    }),
  toggleMinimize: (id: string) =>
    set((state) => {
      if (state.activeIds.includes(id)) {
        const newActiveIds = state.activeIds.filter((activeId) => activeId !== id);
        const newMinimizedIds = [...state.minimizedIds, id];
        saveToStorage(newActiveIds, newMinimizedIds, state.registry);
        return {
          activeIds: newActiveIds,
          minimizedIds: newMinimizedIds,
        };
      }
      const newActiveIds = [...state.activeIds, id];
      const newMinimizedIds = state.minimizedIds.filter((minimizedId) => minimizedId !== id);
      saveToStorage(newActiveIds, newMinimizedIds, state.registry);
      return {
        activeIds: newActiveIds,
        minimizedIds: newMinimizedIds,
      };
    }),
  replaceChat: (oldId: string, newId: string) => {
    set((state) => {
      const restRegistry = { ...state.registry };
      delete restRegistry[oldId];

      const newRegistry: Record<string, ChatMeta> = {
        ...restRegistry,
        [newId]: { type: "conversation", conversationId: newId },
      };
      const newActiveIds = state.activeIds.map((id) => (id === oldId ? newId : id));
      const newMinimizedIds = state.minimizedIds.map((id) => (id === oldId ? newId : id));
      saveToStorage(newActiveIds, newMinimizedIds, newRegistry);
      return {
        activeIds: newActiveIds,
        minimizedIds: newMinimizedIds,
        registry: newRegistry,
      };
    });
  },
  reset: () =>
    set(() => {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      return {
        activeIds: [],
        minimizedIds: [],
        registry: {},
      };
    }),
  setFocusOn: (id) => set({ focusOnId: id }),
}));
