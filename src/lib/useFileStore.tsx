import { create } from "zustand";

import { immer } from "zustand/middleware/immer";
import { AnalyticsAction, sendAnalyticsEvent } from "./googleAnalytics";

export let acceptedFileExtensions = ["fc", "func", "pkg", "tolk"];
if (import.meta.env.VITE_ALLOW_FIFT) acceptedFileExtensions.push("fift");

// Utility function to sort files by directory depth (deeper directories first)
const sortFilesByDepth = (files: FileToUpload[]): FileToUpload[] => {
  return files.sort((a, b) => {
    // Calculate directory depth by counting path separators
    const depthA = (a.relativePath.match(/\//g) || []).length;
    const depthB = (b.relativePath.match(/\//g) || []).length;

    // Primary sort: deeper directories first (higher depth first)
    if (depthA !== depthB) {
      return depthB - depthA;
    }

    // Secondary sort: alphabetical by relative path for same depth
    return a.relativePath.localeCompare(b.relativePath);
  });
};

export type FileToUpload = {
  fileObj: File;
  fileId: string; // unique identifier: folder/filename or just filename
  includeInCommand: boolean;
  hasIncludeDirectives: boolean;
  isEntrypoint: boolean;
  isStdlib: boolean;
  folder: string;
  relativePath: string; // full relative path including filename
};

type State = {
  files: FileToUpload[];
};

type DerivedState = {
  hasFiles: () => boolean;
};

type Actions = {
  addFiles: (files: File[]) => void;
  setInclueInCommand: (fileId: string, include: boolean) => void;
  setDirectory: (fileId: string, folder: string) => void;
  removeFile: (fileId: string) => void;
  reorderFiles: (fileBeingReplaced: string, fileToReplaceWith: string) => void;
  reset: () => void;
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

          // Get relative path from webkitRelativePath (directory upload) or path property (drag-and-drop)
          const relativePath = (f as any).webkitRelativePath || (f as any).path || f.name;
          const pathParts = relativePath.split("/").filter((part: string) => part);
          const folder = pathParts.length > 1 ? pathParts.slice(0, -1).join("/") : "";
          const fileId = folder ? `${folder}/${f.name}` : f.name;

          return {
            fileObj: f,
            fileId,
            relativePath,
            includeInCommand: true,
            folder,
            hasIncludeDirectives: content.includes("#include"),
            isEntrypoint:
              /\(\)\s*(recv_internal|recv_external|main)\s*\(/.test(content) ||
              /fun (onInternalMessage|onExternalMessage)\s*\(/.test(content),
            isStdlib: /stdlib.(fc|func)/i.test(f.name),
          };
        }),
      );

      set((state) => {
        const filesToAdd = modifiedFiles.filter(
          (f) =>
            f.fileObj.name.match(new RegExp(`.*\.(${acceptedFileExtensions.join("|")})$`)) &&
            !state.files.find((existingF) => existingF.fileId === f.fileId),
        );

        if (filesToAdd) {
          sendAnalyticsEvent(AnalyticsAction.ADD_FILE);
          state.files.push(...filesToAdd);
          // Auto-sort files by directory depth after adding new files
          state.files = sortFilesByDepth(state.files);
        }
      });
    },
    setInclueInCommand: (fileId: string, include: boolean) => {
      set((state) => {
        const file = state.files.find((f) => f.fileId === fileId);
        if (file) {
          file.includeInCommand = include;
        }
      });
    },
    setDirectory: (fileId: string, folder: string) => {
      set((state) => {
        const file = state.files.find((f) => f.fileId === fileId);
        if (file) {
          file.folder = folder;
          // Update fileId and relativePath when directory changes
          const newFileId = folder ? `${folder}/${file.fileObj.name}` : file.fileObj.name;
          file.fileId = newFileId;
          file.relativePath = newFileId;
        }
      });
    },
    removeFile: (fileId: string) => {
      set((state) => {
        state.files = state.files.filter((f) => f.fileId !== fileId);
      });
    },
    reorderFiles: (fileBeingReplaced: string, fileToReplaceWith: string) => {
      set((state) => {
        const files = state.files;
        const oldIndex = files.findIndex((f) => f.fileId === fileBeingReplaced);
        const newIndex = files.findIndex((f) => f.fileId === fileToReplaceWith);
        if (oldIndex !== -1 && newIndex !== -1) {
          const [removed] = files.splice(oldIndex, 1);
          files.splice(newIndex, 0, removed);
        }
      });
    },
    reset: () => {
      set((state) => {
        state.files = [];
      });
    },
  })),
);
