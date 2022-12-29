import { useEffect } from "react";
import create from "zustand";
import { useCustomMutation } from "./useCustomMutation";
import { backends, useSubmitSources } from "./useSubmitSources";

export const useSignatureStore = create<{
  backendsUsed: Set<string>;
  addSignature: (backend: string) => void;
  clear: () => void;
}>((set) => ({
  backendsUsed: new Set(),
  addSignature: (backend: string) => {
    set((state) => ({
      backendsUsed: state.backendsUsed.add(backend),
    }));
  },
  clear: () => {
    set({ backendsUsed: new Set() });
  },
}));

export function randomFromArray<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}
