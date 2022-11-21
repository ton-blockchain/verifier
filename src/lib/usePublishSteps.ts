import create from "zustand";

export const STEPS = {
  COMPILE: "COMPILE",
  PUBLISH: "PUBLISH",
};

export const SECTIONS = {
  SOURCES: "SOURCES",
  PUBLISH: "PUBLISH",
};

const publishSteps = (set: any) => ({
  step: STEPS.COMPILE,
  currentSection: SECTIONS.SOURCES,
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
});

export const usePublishStore = create(publishSteps);
