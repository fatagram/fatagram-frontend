import { create } from "zustand";

const GRACE_PERIOD_MS = 3000;

interface TypingState {
  typingMap: Record<string, string[]>;
  lastMessageTimestamp: Record<string, Record<string, number>>;
  addTypingUser: (convId: string, userId: string) => void;
  removeTypingUser: (convId: string, userId: string) => void;
  recordMessage: (convId: string, userId: string) => void;
}

export const useTypingStore = create<TypingState>((set, get) => ({
  typingMap: {},
  lastMessageTimestamp: {},

  addTypingUser: (convId, userId) =>
    set((state) => {
      const lastMsgTime = get().lastMessageTimestamp[convId]?.[userId];
      if (lastMsgTime && Date.now() - lastMsgTime < GRACE_PERIOD_MS) {
        return state;
      }

      const currentUsers = state.typingMap[convId] || [];
      if (currentUsers.find((u) => u === userId)) return state;

      return {
        typingMap: {
          ...state.typingMap,
          [convId]: [...currentUsers, userId],
        },
      };
    }),

  removeTypingUser: (convId, userId) =>
    set((state) => ({
      typingMap: {
        ...state.typingMap,
        [convId]: (state.typingMap[convId] || []).filter((u) => u !== userId),
      },
    })),

  recordMessage: (convId, userId) =>
    set((state) => ({
      lastMessageTimestamp: {
        ...state.lastMessageTimestamp,
        [convId]: {
          ...(state.lastMessageTimestamp[convId] || {}),
          [userId]: Date.now(),
        },
      },
    })),
}));
