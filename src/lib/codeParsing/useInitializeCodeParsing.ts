import { useEffect } from "react";
import { useContractAddress } from "../useContractAddress";
import { useLoadContractProof } from "../useLoadContractProof";
import { parseGetters } from "./getters/getterParser";
import { useCustomGetter } from "./getters/useCustomGetter";
import { _useGetters } from "./getters/useGetters";
import { useExitCodes } from "./exitCodes/useExitCodes";
import { parseExitCodes } from "./exitCodes/exitCodeParser";
import { initParser, createParser } from "./parser";

export function useInitializeCodeParsing() {
  const { data } = useLoadContractProof();

  const { setGetters } = _useGetters();
  const { clear } = useCustomGetter();
  const { setExitCodes } = useExitCodes();

  const { contractAddress } = useContractAddress();

  useEffect(() => {
    setGetters([]);
    setExitCodes([]);
    clear();
  }, [contractAddress]);

  useEffect(() => {
    (async () => {
      await initParser("./tree-sitter-func.wasm");
      const p = createParser();

      const _getterConfig = [];
      const _exitCodes = [];
      for (const f of data?.files ?? []) {
        if (!f.name.match(/\.(fc|func)/)) continue;
        _getterConfig.push(...(await parseGetters(f.content, p)));
        _exitCodes.push(...(await parseExitCodes(f.content, p)));
      }
      setExitCodes(_exitCodes);
      setGetters(_getterConfig);
      clear();
    })();
  }, [data?.files]);
}
