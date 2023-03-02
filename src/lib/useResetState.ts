import { useEffect } from "react";
import { useSubmitSources } from "./useSubmitSources";
import { useFileStore } from "./useFileStore";
import { useContractAddress } from "./useContractAddress";
import { usePublishStore } from "./usePublishSteps";
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

export function useResetState() {
  const { contractAddress } = useContractAddress();
  const submitSourcesState = useSubmitSources();
  const { reset: resetFileStore } = useFileStore();
  const { reset: resetPublishStore } = usePublishStore();
  const { isPreloaded, clearPreloaded } = usePreload();

  useEffect(() => {
    if (!isPreloaded) {
      resetFileStore();
    } else {
      // Clear for next address
      clearPreloaded();
    }
    resetPublishStore();
    submitSourcesState.invalidate();
  }, [contractAddress]);
}
