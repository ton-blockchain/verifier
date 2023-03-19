import { create } from "zustand";
import { StateGetter, Parameter } from "./useGetters";
import { immer } from "zustand/middleware/immer";

export type CustomStateGetter = StateGetter & {
  parameters: CustomParameter[];
  setName: (val: string) => void;
  addParameter: () => void;
  removeParameter: () => void;
  clear: () => void;
};

type CustomParameter = Parameter & {
  _id: number;
  setName: (name: string) => void;
};

export const _useCustomGetter = create(
  immer<CustomStateGetter>((set, get) => ({
    name: "",
    setName: (val: string) => {
      set((state) => {
        state.name = val;
      });
    },
    parameters: [],
    addParameter: () => {
      set((state) => {
        const _id = Math.random();
        state.parameters.push({
          name: "",
          _id,
          possibleTypes: ["int", "slice", "address"],
          selectedTypeIdx: 0,
          setValue: (val) =>
            (state.parameters.find((p: CustomParameter) => p._id === _id)!.value = val),
          setName: (val: string) => {
            set((state) => {
              state.parameters.find((p: CustomParameter) => p._id === _id)!.name = val;
            });
          },
          toggleNextType: () => {
            set((state) => {
              const param = state.parameters.find((p: CustomParameter) => p._id === _id)!;
              param.selectedTypeIdx = (param.selectedTypeIdx + 1) % param.possibleTypes.length;
            });
          },
          type: () => {
            const param = get().parameters.find((p: CustomParameter) => p._id === _id)!;
            return param.possibleTypes[param.selectedTypeIdx];
          },

          originalType: () => {
            const param = get().parameters.find((p: CustomParameter) => p._id === _id)!;
            return param.possibleTypes[0];
          },
          value: "",
        });
      });
    },
    returnTypes: [],
    removeParameter: () => {
      set((state) => {
        state.parameters.pop();
      });
    },
    clear: () => {
      set((state) => {
        state.name = "";
        state.parameters = [];
      });
    },
  })),
);

export function useCustomGetter() {
  const customGetter = _useCustomGetter();
  return customGetter;
}
