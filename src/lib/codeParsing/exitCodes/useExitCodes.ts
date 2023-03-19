import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type ExitCodeState = {
  exitCodes: string[];
  setExitCodes: (exitCodes: string[]) => void;
};

export const useExitCodes = create(
  immer<ExitCodeState>((set, get) => ({
    exitCodes: [],
    setExitCodes: (exitCodes: string[]) => {
      set({ exitCodes });
    },
  })),
);
