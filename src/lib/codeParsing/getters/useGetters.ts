import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Getter } from "./getterParser";

type ParameterType = "address" | "cell" | "slice" | "int";

export type Parameter = {
  name: string;
  value: string;
  possibleTypes: ParameterType[]; // TODO add more
  selectedTypeIdx: number;
  toggleNextType: () => void;
  type: () => ParameterType;
  setValue: (value: string) => void;
  originalType: () => ParameterType;
};

export type StateGetter = {
  name: string;
  parameters: Parameter[];
  returnTypes: string[];
};

const parameterByName = (getters: StateGetter[], getterName: string, parameterName: string) =>
  getters.find((_g) => _g.name === getterName)!.parameters.find((_p) => _p.name === parameterName)!;

type GetterState = {
  getters: StateGetter[];
  setGetters: (getters: Getter[]) => void;
};

export const _useGetters = create(
  immer<GetterState>((set, get) => ({
    getters: [],

    setGetters: (getters: Getter[]) => {
      set((state) => {
        const stateGetters: StateGetter[] = getters.map((g) => {
          return {
            name: g.name,
            parameters: g.parameters.map((p) => {
              const possibleTypes = [p.type as ParameterType];
              if (["cell", "slice"].includes(p.type)) {
                possibleTypes.push("address");
              }
              return {
                name: p.name,
                value: "",
                possibleTypes,
                selectedTypeIdx: 0,

                toggleNextType: () => {
                  set((state) => {
                    const param = parameterByName(state.getters, g.name, p.name);
                    param.selectedTypeIdx =
                      (param.selectedTypeIdx + 1) % param.possibleTypes.length;
                  });
                },

                type: () => {
                  const param = parameterByName(get().getters, g.name, p.name);
                  return param.possibleTypes[param.selectedTypeIdx];
                },

                originalType: () => {
                  const param = parameterByName(get().getters, g.name, p.name);
                  return param.possibleTypes[0];
                },

                setValue: (value: string) => {
                  set((state) => {
                    const param = parameterByName(state.getters, g.name, p.name);
                    param.value = value;
                  });
                },
              };
            }),
            returnTypes: g.returnTypes,
          };
        });

        state.getters = stateGetters;
      });
    },
  })),
);

export function useGetters() {
  const { getters } = _useGetters();
  return { getters };
}
