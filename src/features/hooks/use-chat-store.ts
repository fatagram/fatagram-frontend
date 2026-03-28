import { ChatMeta } from "@/types/chat-meta";
import { create } from "zustand";

interface ChatWindowState {
  activeIds: string[];
  minimizedIds: string[];
  registry: Record<string, ChatMeta>;
  openChat: (id: string, meta: ChatMeta) => void;
  closeChat: (id: string) => void;
  toggleMinimize: (id: string) => void;
  replaceChat: (oldId: string, newId: string) => void;
  reset?: () => void;
}

export const useChatStore = create<ChatWindowState>((set) => ({
  activeIds: [],
  minimizedIds: [],
  registry: {},
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

      return {
        activeIds: newActiveIds,
        minimizedIds: newMinimizedIds,
        registry: newRegistry,
      };
    }),
  closeChat: (id: string) =>
    set((state) => ({
      activeIds: state.activeIds.filter((activeId) => activeId !== id),
      minimizedIds: state.minimizedIds.filter((minimizedId) => minimizedId !== id),
    })),
  toggleMinimize: (id: string) =>
    set((state) => {
      if (state.activeIds.includes(id)) {
        return {
          activeIds: state.activeIds.filter((activeId) => activeId !== id),
          minimizedIds: [...state.minimizedIds, id],
        };
      }
      return {
        activeIds: [...state.activeIds, id],
        minimizedIds: state.minimizedIds.filter((minimizedId) => minimizedId !== id),
      };
    }),
  replaceChat: (oldId: string, newId: string) => {
    set((state) => {
      const { [oldId]: _, ...restRegistry } = state.registry;
      return {
        activeIds: state.activeIds.map((id) => (id === oldId ? newId : id)),
        minimizedIds: state.minimizedIds.map((id) => (id === oldId ? newId : id)),
        registry: {
          ...restRegistry,
          [newId]: { type: "conversation", conversationId: newId },
        },
      };
    });
  },
  reset: () =>
    set(() => ({
      activeIds: [],
      minimizedIds: [],
      registry: {},
    })),
}));
