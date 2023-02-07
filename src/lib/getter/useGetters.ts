import { useState, useEffect } from "react";
import { create } from "zustand";
import { useLoadContractProof } from "../useLoadContractProof";
import { Getter, GetterParameter, parseGetters } from "./getterParser";

type FilledGetterParameter = {
  name: string;
  value: string;
  possibleTypes: ("address" | "cell" | "slice" | "int")[]; // TODO add more
  selectedTypeIdx: number;
};

const _useGetterParameters = create<{
  getterParams: Record<string, FilledGetterParameter[]>;
  nextType: (getterName: string, index: number) => void;
  setValue: (getterName: string, index: number, value: string) => void;
  setGetters: (getter: Getter[]) => void;
}>((set, get) => ({
  getterParams: {},
  nextType(getterName: string, index) {
    const { getterParams } = get();

    const param = getterParams[getterName][index];

    param.selectedTypeIdx = (param.selectedTypeIdx + 1) % param.possibleTypes.length;
    set({ getterParams });
  },
  setValue(getterName: string, index: number, value: string) {
    const { getterParams } = get();

    getterParams[getterName][index].value = value;
    set({ getterParams });
  },
  setGetters(getters: Getter[]) {
    const getterParams = Object.fromEntries(
      getters.map((g) => [
        g.name,
        g.parameters.map((p) => {
          const possibleTypes = [p.type as "address" | "cell" | "slice" | "int"];
          const selectedTypeIdx = 0;

          if (p.type === "slice" || p.type === "cell") {
            possibleTypes.push("address");
          }

          return { ...p, value: "", possibleTypes, selectedTypeIdx };
        }),
      ]),
    );
    set({ getterParams });
  },
  clear() {
    // TODO
  },
}));

export function useGetters() {
  const { data } = useLoadContractProof();

  const [getterConfig, setGetterConfig] = useState<Getter[] | null>(null);

  useEffect(() => {
    (async () => {
      const _getterConfig = [];
      for (const f of data?.files ?? []) {
        _getterConfig.push(...(await parseGetters(f.content)));
      }
      setGetterConfig(_getterConfig);
    })();
  }, [data?.files]);

  const { setGetters, setValue, getterParams, nextType } = _useGetterParameters();
  useEffect(() => {
    if (!getterConfig) return;
    setGetters(getterConfig);
  }, [getterConfig]);

  return { setValue, getters: getterConfig, getterParams, nextType };
}
