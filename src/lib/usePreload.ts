import { create } from "zustand";

// Adds support for preloading files from a different page,
// to prevent resetting the file store when the address changes
export const usePreload = create<{
  isPreloaded: boolean;
  markPreloaded: () => void;
  clearPreloaded: () => void;
}>((set) => ({
  isPreloaded: false,
  markPreloaded: () => {
    set({ isPreloaded: true });
  },
  clearPreloaded: () => {
    set({ isPreloaded: false });
  },
}));
