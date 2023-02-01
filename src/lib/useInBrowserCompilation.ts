import { SourceEntry } from "@ton-community/func-js";
import { Cell } from "ton";
import { isWebAssemblySupported } from "../utils/generalUtils";
import { useLoadContractProof } from "./useLoadContractProof";
import { useLoadContractInfo } from "./useLoadContractInfo";
import { useState } from "react";
import { FuncCompilerSettings } from "@ton-community/contract-verifier-sdk";
import { AnalyticsAction, sendAnalyticsEvent } from "./googleAnalytics";

export enum VerificationResults {
  VALID = "VALID",
  WASM = "WebAssembly is not supported",
  COMPILER = "Only FunC contracts can be verified",
  VERSION = "FunC version is not supported",
}

const compilerSupportedVersions = ["0.2.0", "0.3.0", "0.4.0", "0.4.1"];

export function useInBrowserCompilation() {
  const { data } = useLoadContractProof();
  const { data: contractData } = useLoadContractInfo();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string | null>(null);

  const verifyContract = async () => {
    sendAnalyticsEvent(AnalyticsAction.IN_BROWSER_COMPILE_START);
    setError(null);
    setLoading(true);

    const { FuncCompiler } = await import("@ton-community/func-js");

    const sources: SourceEntry[] =
      data?.files?.map((file) => ({ filename: file.name, content: file.content })) ?? [];

    const funcVersion = (data?.compilerSettings as FuncCompilerSettings)?.funcVersion;

    if (!funcVersion) {
      setError(`FunC is not available for in-browser verification`);
      setLoading(false);
      return;
    }

    let compilerInstance: any;

    switch (funcVersion) {
      case "0.2.0": {
        let { object: instance } = await import("func-js-bin-0.2.0");
        compilerInstance = instance;
        break;
      }
      case "0.3.0": {
        let { object: instance } = await import("func-js-bin-0.3.0");
        compilerInstance = instance;
        break;
      }
      case "0.4.0": {
        let { object: instance } = await import("func-js-bin-0.4.0");
        compilerInstance = instance;
        break;
      }
      case "0.4.1": {
        let { object: instance } = await import("func-js-bin-0.4.1");
        compilerInstance = instance;
        break;
      }
    }

    const funcCompiler = new FuncCompiler(compilerInstance);

    let result = await funcCompiler.compileFunc({
      sources,
      targets: (data?.compilerSettings as FuncCompilerSettings).commandLine
        .split(" ")
        .filter((s) => s.match(/\.(fc|func)$/)),
    });

    if (result.status === "error") {
      setError(result.message);
      setLoading(false);
      sendAnalyticsEvent(AnalyticsAction.IN_BROWSER_COMPILE_ERROR);
      return;
    }

    const codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0];
    setLoading(false);

    contractData?.hash === codeCell.hash().toString("base64") &&
      setHash(codeCell.hash().toString("base64"));

    sendAnalyticsEvent(AnalyticsAction.IN_BROWSER_COMPILE_SUCCESS);
  };

  const isVerificationEnabled = () => {
    if (!isWebAssemblySupported()) {
      return VerificationResults.WASM;
    }
    if (data?.compiler !== "func") {
      return VerificationResults.COMPILER;
    }
    if (!verifyCompilerVersion()) {
      return VerificationResults.VERSION;
    }
    return VerificationResults.VALID;
  };

  const verifyCompilerVersion = () => {
    return compilerSupportedVersions.some(
      (v) => v === (data?.compilerSettings as FuncCompilerSettings)?.funcVersion,
    );
  };

  return { verifyContract, isVerificationEnabled, loading, error, hash };
}
