import { useEffect } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Getter, parseGetters } from "./getterParser";

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

const parameterByName = (
  getters: Record<string, StateGetter[]>,
  key: string,
  getterName: string,
  parameterName: string,
) => {
  return getters[key]
    ?.find((_g) => _g.name === getterName)
    ?.parameters.find((_p) => _p.name === parameterName)!;
};

type GetterState = {
  gettersByKey: Record<string, StateGetter[]>;
  setGetters: (key: string, getters: Getter[]) => void;
  clearForKey: (key: string) => void;
};

const _useGetters = create(
  immer<GetterState>((set, get) => ({
    gettersByKey: {},

    setGetters: (key, getters) => {
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
                    const param = parameterByName(state.gettersByKey, key, g.name, p.name);
                    param.selectedTypeIdx =
                      (param.selectedTypeIdx + 1) % param.possibleTypes.length;
                  });
                },

                type: () => {
                  const param = parameterByName(get().gettersByKey, key, g.name, p.name);
                  return param.possibleTypes[param.selectedTypeIdx];
                },

                originalType: () => {
                  const param = parameterByName(get().gettersByKey, key, g.name, p.name);
                  return param.possibleTypes[0];
                },

                setValue: (value: string) => {
                  set((state) => {
                    const param = parameterByName(state.gettersByKey, key, g.name, p.name);
                    param.value = value;
                  });
                },
              };
            }),
            returnTypes: g.returnTypes,
          };
        });

        state.gettersByKey[key] = stateGetters;
      });
    },

    clearForKey: (key) => {
      set((state) => {
        delete state.gettersByKey[key];
      });
    },
  })),
);

export function useGetters(key: string | null) {
  const getters = _useGetters((state) => (key ? (state.gettersByKey[key] ?? []) : [])) ?? [];
  return { getters };
}

export function useSyncGetters(key: string | null, files?: { name: string; content: string }[]) {
  const { setGetters, clearForKey } = _useGetters();

  useEffect(() => {
    if (!key) return;
    if (!files?.length) {
      clearForKey(key);
      return;
    }
    (async () => {
      const parsed: Getter[] = [];
      for (const f of files) {
        if (!f.name.match(/\.(fc|func)$/)) continue;
        parsed.push(...(await parseGetters(f.content)));
      }
      setGetters(key, parsed);
    })();
    return () => {
      clearForKey(key);
    };
  }, [key, files]);
}
