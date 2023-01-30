import { useMutation } from "@tanstack/react-query";
import BN from "bn.js";
import { useState, useEffect } from "react";
import { Address, Cell, toNano, fromNano } from "ton";
import Parser from "web-tree-sitter";
import { create } from "zustand";
import { isWebAssemblySupported } from "../utils/generalUtils";
import { getClient } from "./getClient";
import { makeGetCall } from "./makeGetCall";
import { useContractAddress } from "./useContractAddress";
import { useLoadContractProof } from "./useLoadContractProof";

let language: Parser.Language;

export const initParser = async (treeSitterUri: string, langUri: string) => {
  if (language) {
    return;
  }
  const options: object | undefined = {
    locateFile() {
      return treeSitterUri;
    },
  };
  await Parser.init(options);
  language = await Parser.Language.load(langUri);
};

export const createParser = () => {
  const parser = new Parser();
  parser.setLanguage(language);
  parser.setTimeoutMicros(1000 * 1000);
  return parser;
};

export type GetterParameter = {
  type: string;
  name: string;
};

export type Getter = {
  returnTypes: string[];
  name: string;
  parameters: GetterParameter[];
};

async function parseGetters(code: string): Promise<Getter[]> {
  if (!isWebAssemblySupported()) {
    return [];
  }

  await initParser("./tree-sitter.wasm", "./tree-sitter-func.wasm");
  const p = createParser();
  const parsed = p.parse(code);

  language = p.getLanguage();

  const getters = parsed.rootNode.children.filter(
    (c) =>
      c.type === "function_definition" &&
      c.children.find((n) => n.type === "specifiers_list")?.text.includes("method_id"),
  );

  const gettersParsed = getters.map((f) => {
    const returnTypes = f.children[0].children
      .filter((c) => !c.type.match(/[,()]/)) // TODO types are slice, primitive_type, ",", "(", ")"
      .map((c) => c.text);

    const name = f.children.find((n) => n.type === "function_name")!.text;

    const parameters = f.children
      .find((n) => n.type === "parameter_list")!
      .children.filter((c) => c.type === "parameter_declaration")
      .map((c) => ({
        type: c.child(0)!.text,
        name: c.child(1)!.text,
      }));

    return {
      returnTypes,
      name,
      parameters,
    };
  });

  return gettersParsed;
}

type FilledGetterParameter = GetterParameter & { value: string };

const _useGetterParameters = create<{
  getterParams: Record<string, FilledGetterParameter[]>;
  setValue: (getterName: string, index: number, value: string) => void;
  setGetters: (getter: Getter[]) => void;
}>((set, get) => ({
  getterParams: {},
  setValue(getterName: string, index: number, value: string) {
    const { getterParams } = get();

    getterParams[getterName][index].value = value;
    set({ getterParams });
  },
  setGetters(getters: Getter[]) {
    const getterParams = Object.fromEntries(
      getters.map((g) => [g.name, g.parameters.map((p) => ({ ...p, value: "" }))]),
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
      for (const f of data?.files ?? []) {
        const _getterConfig = await parseGetters(f.content);
        if (_getterConfig.length > 0) {
          setGetterConfig(_getterConfig);
          break;
        }
      }
    })();
  }, [data?.files]);

  const { setGetters, setValue, getterParams } = _useGetterParameters();
  useEffect(() => {
    if (!getterConfig) return;
    setGetters(getterConfig);
  }, [getterConfig]);

  return { setValue, getters: getterConfig, getterParams };
}

type PossibleRepresentation = "address" | "coins" | "base64" | "boc" | "int" | "raw" | "hex";

export type GetterResponseValue = { type: PossibleRepresentation; value: string };

export function useQueryGetter(name: string) {
  const { contractAddress } = useContractAddress();
  const { getters, getterParams } = useGetters();

  return useMutation(["getter", name], async () => {
    const tc = await getClient();
    if (!contractAddress) return;
    if (!getters) return;

    const resp = makeGetCall(
      Address.parse(contractAddress),
      name,
      getterParams[name].map((param, i) => {
        switch (param.type) {
          case "int":
            return new BN(param.value);
          default:
            return Cell.fromBoc(Buffer.from(param.value, "base64"))[0];
        }
      }),
      (s) => {
        return s.map((value) => {
          const possibleRepresentations: { type: PossibleRepresentation; value: string }[] = [];
          if (value instanceof Cell) {
            try {
              if (value.beginParse().remaining === 267) {
                possibleRepresentations.push({
                  type: "address",
                  value: value.beginParse().readAddress()!.toFriendly(),
                });
              }
            } catch (e) {
              // Ignore
            }

            possibleRepresentations.push({
              type: "base64",
              value: value.toBoc().toString("base64"),
            });
            possibleRepresentations.push({ type: "boc", value: value.toDebugString() });
          } else if (value instanceof BN) {
            possibleRepresentations.push({ type: "int", value: value.toString() });
            possibleRepresentations.push({ type: "coins", value: fromNano(value) });
            possibleRepresentations.push({ type: "hex", value: value.toString("hex") });
            possibleRepresentations.push({
              type: "base64",
              value: Buffer.from(value.toString("hex"), "hex").toString("base64"),
            });
          } else {
            possibleRepresentations.push({ type: "raw", value: String(value) });
          }

          return possibleRepresentations as GetterResponseValue[];
        });
      },
      tc,
    );

    return resp;
  });
}
