import { useEffect } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useLoadContractProof } from "../useLoadContractProof";
import { Getter, parseGetters } from "./getterParser";

type ParameterType = "address" | "cell" | "slice" | "int";

type Parameter = {
  name: string;
  value: string;
  possibleTypes: ParameterType[]; // TODO add more
  selectedTypeIdx: number;
  toggleNextType: () => void;
  type: () => ParameterType;
  setValue: (value: string) => void;
};

type CustomParameter = Parameter & {
  _id: number;
  setName: (name: string) => void;
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

type CustomStateGetter = StateGetter & {
  parameters: CustomParameter[];
  setName: (val: string) => void;
  addParameter: () => void;
};

export const _useCustomGetter = create(
  immer<CustomStateGetter>((set, get) => ({
    name: "",
    setName: (val: string) => set((state) => (state.name = val)),
    parameters: [],
    addParameter: () => {
      set((state) => {
        const _id = Math.random();
        state.parameters.push({
          name: "",
          _id,
          possibleTypes: ["int", "slice", "address"],
          selectedTypeIdx: 0,
          setValue: (val) => (state.parameters.find((p) => p._id === _id)!.value = val),
          setName: (val) => (state.parameters.find((p) => p._id === _id)!.name = val),
          toggleNextType: () => {
            const param = state.parameters.find((p) => p._id === _id)!;
            param.selectedTypeIdx = (param.selectedTypeIdx + 1) % length;
          },
          type: () => {
            const param = state.parameters.find((p) => p._id === _id)!;
            return param.possibleTypes[param.selectedTypeIdx];
          },
          value: "",
        });
      });
    },
    returnTypes: [],
  })),
);

const _useGetters = create(
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

                setValue: (value: string) => {
                  const param = parameterByName(get().getters, g.name, p.name);
                  param.value = value;
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

export function useGetters2() {
  const { getters, setGetters } = _useGetters();
  return { getters, setGetters };
}

export function useGetterParameter(getterName: string, parameterName: string) {
  const { getters } = _useGetters();
  return parameterByName(getters, getterName, parameterName);
}

export function useCustomGetter() {
  const customGetter = _useCustomGetter();
  return customGetter;
}

export function useGetters() {
  const { data } = useLoadContractProof();

  const { setGetters: setGetters2, getters } = useGetters2();

  useEffect(() => {
    (async () => {
      const _getterConfig = [];
      for (const f of data?.files ?? []) {
        _getterConfig.push(...(await parseGetters(f.content)));
      }
      setGetters2(_getterConfig);
    })();
  }, [data?.files]);

  return { getters };
}
