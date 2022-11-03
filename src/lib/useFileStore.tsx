import create from "zustand";

import { immer } from "zustand/middleware/immer";

export type FileToUpload = {
  fileObj: File;
  includeInCommand: boolean;
  hasIncludeDirectives: boolean;
  isEntrypoint: boolean;
  isStdlib: boolean;
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
  reorderFiles: (fileBeingReplaced: string, fileToReplaceWith: string) => void;
};

export const useFileStore = create(
  immer<State & DerivedState & Actions>((set, get) => ({
    // State
    files: [],

    // Derived
    hasFiles: () => get().files.length > 0,

    // Actions
    addFiles: async (files) => {
      const modifiedFiles = await Promise.all(
        files.map(async (f) => {
          const content = await f.text();
          return {
            fileObj: f,
            includeInCommand: true,
            folder: "",
            hasIncludeDirectives: content.includes("#include"),
            isEntrypoint: /\(\)\s*(recv_internal|main)\s*\(/.test(content),
            isStdlib: /stdlib.(fc|func)/i.test(f.name),
          };
        })
      );

      set((state) => {
        state.files.push(
          ...modifiedFiles.filter(
            (f) =>
              f.fileObj.name.match(/.*\.(fc|func)/) &&
              !state.files.find(
                (existingF) => existingF.fileObj.name === f.fileObj.name
              )
          )
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
    reorderFiles: (fileBeingReplaced: string, fileToReplaceWith: string) => {
      set((state) => {
        const files = state.files;
        const oldIndex = files.findIndex(
          (f) => f.fileObj.name === fileBeingReplaced
        );
        const newIndex = files.findIndex(
          (f) => f.fileObj.name === fileToReplaceWith
        );
        const [removed] = files.splice(oldIndex, 1);
        files.splice(newIndex, 0, removed);
      });
    },
  }))
);
