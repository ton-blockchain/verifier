import create from "zustand";

export const STEPS = {
  COMPILE: "COMPILE",
  PUBLISH: "PUBLISH",
};

export const SECTIONS = {
  SOURCES: "SOURCES",
  PUBLISH: "PUBLISH",
};

const DEFAULT = () => ({
  step: STEPS.COMPILE,
  currentSection: SECTIONS.SOURCES,
});

const publishSteps = (set: any) => ({
  ...DEFAULT(),
  proceedToPublish: () => {
    set({
      step: STEPS.PUBLISH,
      currentSection: SECTIONS.PUBLISH,
    });
  },
  toggleSection: (section: string) => {
    set({
      currentSection: section,
    });
  },
  reset: () => {
    set(DEFAULT());
  },
});

export const usePublishStore = create(publishSteps);
