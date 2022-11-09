import create from "zustand";

export const usePublishStepsStore = create<{
  isPublishExpanded: boolean;
  isAddSourcesExpanded: boolean;
  setPublishExpanded: (isExpanded: boolean) => void;
  setAddSourcesExpanded: (isExpanded: boolean) => void;
}>((set) => ({
  isPublishExpanded: false,
  isAddSourcesExpanded: true,
  setPublishExpanded: (isExpanded: boolean) => set({ isPublishExpanded: isExpanded }),
  setAddSourcesExpanded: (isExpanded: boolean) => set({ isAddSourcesExpanded: isExpanded }),
}));
