import { create } from "zustand";
import React from "react";

interface BottomSheetState {
  isOpen: boolean;
  content: React.ReactNode | null;
  title?: string;
  openSheet: (content: React.ReactNode, title?: string) => void;
  closeSheet: () => void;
}

export const useBottomSheetStore = create<BottomSheetState>((set) => ({
  isOpen: false,
  content: null,
  title: "",

  openSheet: (content, title) => set({ isOpen: true, content, title }),

  closeSheet: () => set({ isOpen: false, content: null, title: "" }),
}));
