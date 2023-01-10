import { SourceEntry, FuncCompiler } from "@ton-community/func-js";
import { Cell } from "ton";
import { isWebAssemblySupported } from "../utils/generalUtils";
import { useLoadContractProof } from "./useLoadContractProof";
import { useLoadContractInfo } from "./useLoadContractInfo";
import { useState } from "react";

const compilerSupportedVersions = ["2", "3"];

export function useInBrowserCompilation() {
  const { data } = useLoadContractProof();
  const { data: contractData } = useLoadContractInfo();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string | null>(null);

  const verifyContract = async () => {
    setError(null);
    setLoading(true);
    const sources: SourceEntry[] = [];

    data?.files?.forEach((file) => {
      sources.push({ filename: file.name, content: file.content });
    });

    //@ts-ignore
    const funcVersion: string = data?.compilerSettings?.funcVersion.slice(2, 3);

    if (!funcVersion) {
      setError(`func is not available for in-browser verification`);
      setLoading(false);
      return;
    }

    let compilerInstance: any;

    switch (funcVersion) {
      case "2": {
        let { object: instance } = await import("func-js-bin-2");
        compilerInstance = instance;
        break;
      }
      case "3": {
        let { object: instance } = await import("func-js-bin-3");
        compilerInstance = instance;
        break;
      }
    }

    const funcCompiler = new FuncCompiler(compilerInstance);

    let result = await funcCompiler.compileFunc({
      sources: sources.reverse(),
    });

    if (result.status === "error") {
      setError(result.message);
      setLoading(false);
      return;
    }

    const codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0];
    setLoading(false);

    contractData?.hash === codeCell.hash().toString("base64") &&
      setHash(codeCell.hash().toString("base64"));
  };

  const isVerificationEnabled = () =>
    !(!isWebAssemblySupported() || !verifyCompilerVersion() || data?.compiler !== "func");

  const verifyCompilerVersion = () => {
    //@ts-ignore
    return !!compilerSupportedVersions.find(
      (v) => v === data?.compilerSettings?.funcVersion.slice(2, 3),
    );
  };

  return { verifyContract, isVerificationEnabled, loading, error, hash };
}
