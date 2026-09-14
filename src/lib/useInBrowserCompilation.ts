import { SourceEntry } from "@ton-community/func-js";
import { Cell } from "@ton/ton";
import { isWebAssemblySupported } from "../utils/generalUtils";
import {
  ContractProofData,
  findProofByVerifierName,
  getFirstAvailableProof,
  useLoadContractProof,
} from "./useLoadContractProof";
import { useLoadContractInfo } from "./useLoadContractInfo";
import { useState } from "react";
import { FuncCompilerSettings } from "../types/compiler";
import { getValidSources } from "./getSourcesData";
import { AnalyticsAction, sendAnalyticsEvent } from "./googleAnalytics";
import { useLoadVerifierRegistryInfo } from "./useLoadVerifierRegistryInfo";

export enum VerificationResults {
  VALID = "VALID",
  WASM = "WebAssembly is not supported",
  COMPILER = "Only FunC contracts can be verified",
  VERSION = "FunC version is not supported",
}

const funcCompilers = new Map([
  ["0.2.0", async () => (await import("func-js-bin-0.2.0")).object],
  ["0.3.0", async () => (await import("func-js-bin-0.3.0")).object],
  ["0.4.0", async () => (await import("func-js-bin-0.4.0")).object],
  ["0.4.1", async () => (await import("func-js-bin-0.4.1")).object],
  ["0.4.2", async () => (await import("func-js-bin-0.4.2")).object],
  ["0.4.3", async () => (await import("func-js-bin-0.4.3")).object],
  ["0.4.4", async () => (await import("func-js-bin-0.4.4")).object],
  ["0.4.4-newops", async () => (await import("func-js-bin-0.4.4-newops")).object],
  ["0.4.4-newops.1", async () => (await import("func-js-bin-0.4.4-newops.1")).object],
  ["0.4.5", async () => (await import("func-js-bin-0.4.5")).object],
  ["0.4.6", async () => (await import("func-js-bin-0.4.6")).object],
  ["0.4.6-wasmfix.0", async () => (await import("func-js-bin-0.4.6-wasmfix.0")).object],
]);

async function importFuncCompiler(version: string) {
  const doImport = funcCompilers.get(version);
  return doImport && (await doImport());
}

export function useInBrowserCompilation() {
  const { data: proofs } = useLoadContractProof();
  const { data: verifierRegistry } = useLoadVerifierRegistryInfo();
  const { data: contractData } = useLoadContractInfo();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string | null>(null);

  const verifyContract = async () => {
    sendAnalyticsEvent(AnalyticsAction.IN_BROWSER_COMPILE_START);
    setError(null);
    setLoading(true);

    const { FuncCompiler } = await import("@ton-community/func-js");

    const proof = getFirstAvailableProof(proofs);

    const sources: SourceEntry[] = getValidSources(proof?.files).map((file) => ({
      filename: file.name,
      content: file.content,
    }));

    const funcVersion = (proof?.compilerSettings as FuncCompilerSettings)?.funcVersion;

    if (!funcVersion) {
      setError(`FunC is not available for in-browser verification`);
      setLoading(false);
      return;
    }

    const compilerInstance = await importFuncCompiler(funcVersion);
    const funcCompiler = new FuncCompiler(compilerInstance);

    let result = await funcCompiler.compileFunc({
      sources,
      targets: (proof?.compilerSettings as FuncCompilerSettings)?.commandLine
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

    contractData?.codeCellToCompileBase64 === codeCell.hash().toString("base64") &&
      setHash(codeCell.hash().toString("base64"));

    sendAnalyticsEvent(AnalyticsAction.IN_BROWSER_COMPILE_SUCCESS);
  };

  const isVerificationEnabled = () => {
    if (!isWebAssemblySupported()) {
      return VerificationResults.WASM;
    }
    const proof = getFirstAvailableProof(proofs);
    if (proof?.compiler !== "func") {
      return VerificationResults.COMPILER;
    }
    if (!verifyCompilerVersion(proof)) {
      return VerificationResults.VERSION;
    }
    return VerificationResults.VALID;
  };

  const verifyCompilerVersion = (proof?: ContractProofData) => {
    return funcCompilers.has((proof?.compilerSettings as FuncCompilerSettings)?.funcVersion);
  };

  return { verifyContract, isVerificationEnabled, loading, error, hash };
}
