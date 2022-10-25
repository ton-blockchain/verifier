import create from "zustand";

import { immer } from "zustand/middleware/immer";

type FileToUpload = {
  fileObj: File;
  includeInCommand: boolean;
  folder: string;
};

type State = {
  files: FileToUpload[];
};

type DerivedState = {
  hasFiles: () => boolean;
};

type Actions = {
  addFiles: (files: File[]) => void;
  setInclueInCommand: (name: string, include: boolean) => void;
  setDirectory: (name: string, folder: string) => void;
  removeFile: (name: string) => void;
};

export const useFileStore = create(
  immer<State & DerivedState & Actions>((set, get) => ({
    // State
    files: [],

    // Derived
    hasFiles: () => get().files.length > 0,

    // Actions
    addFiles: (files) => {
      set((state) => {
        state.files.push(
          ...files.map((f) => ({
            fileObj: f,
            includeInCommand: true,
            folder: "",
          }))
        );
      });
    },
    setInclueInCommand: (name: string, include: boolean) => {
      set((state) => {
        state.files.find((f) => f.fileObj.name === name)!.includeInCommand =
          include;
      });
    },
    setDirectory: (name: string, folder: string) => {
      set((state) => {
        state.files.find((f) => f.fileObj.name === name)!.folder = folder;
      });
    },
    removeFile: (name: string) => {
      set((state) => {
        state.files = state.files.filter((f) => f.fileObj.name !== name);
      });
    },
  }))
);
