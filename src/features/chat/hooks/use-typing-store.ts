import { create } from "zustand";

interface TypingState {
  typingMap: Record<string, string[]>;
  addTypingUser: (convId: string, userId: string) => void;
  removeTypingUser: (convId: string, userId: string) => void;
}

export const useTypingStore = create<TypingState>((set) => ({
  typingMap: {},
  addTypingUser: (convId, userId) =>
    set((state) => {
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
}));
