import create from "zustand";

export const STEPS = {
  COMPILE: "COMPILE",
  PUBLISH: "PUBLISH",
};

const publishSteps = (set: any) => ({
  step: STEPS.COMPILE,
  proceedToPublish: () => {
    set({
      step: STEPS.PUBLISH,
    });
  },
});

export const usePublishStore = create(publishSteps);
