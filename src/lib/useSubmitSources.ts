import { useLoadContractInfo } from "./useLoadContractInfo";
import { useFileStore } from "./useFileStore";
import { useCompilerSettingsStore } from "./useCompilerSettingsStore";
import { useCustomMutation } from "./useCustomMutation";
import { Cell } from "ton";
import { useContractAddress } from "./useContractAddress";
import { FuncCompilerSettings } from "@ton-community/contract-verifier-sdk";
import { TELEGRAM_SUPPORT_LINK } from "../components/Footer";
import { useWalletConnect } from "./useWalletConnect";
import { AnalyticsAction, sendAnalyticsEvent } from "./googleAnalytics";

export type VerifyResult = {
  compileResult: CompileResult;
  sig?: string;
  ipfsLink?: string;
  msgCell?: Buffer;
};

export type CompileResult = {
  result: "similar" | "not_similar" | "compile_error" | "unknown_error";
  error: string | null;
  hash: string | null;
  funcCmd: string | null;
  compilerSettings: FuncCompilerSettings;
};

function jsonToBlob(json: Record<string, any>): Blob {
  return new Blob([JSON.stringify(json)], {
    type: "application/json",
  });
}

export function useSubmitSources() {
  const { contractAddress } = useContractAddress();
  const { data: contractInfo } = useLoadContractInfo();
  const { hasFiles, files } = useFileStore();
  const { compiler, compilerSettings } = useCompilerSettingsStore();
  const { walletAddress } = useWalletConnect();

  const mutation = useCustomMutation(["submitSources"], async () => {
    if (!contractAddress) return;
    if (!contractInfo?.hash) return;
    if (!hasFiles()) return;
    if (!walletAddress) {
      throw new Error("Wallet is not connected");
    }

    sendAnalyticsEvent(AnalyticsAction.COMPILE_SUBMIT);

    const formData = new FormData();

    for (const f of files) {
      formData.append((f.folder ? f.folder + "/" : "") + f.fileObj.name, f.fileObj);
    }

    formData.append(
      "json",
      jsonToBlob({
        compiler,
        compilerSettings,
        knownContractAddress: contractAddress,
        knownContractHash: contractInfo.hash,
        sources: files.map((u) => ({
          includeInCommand: u.includeInCommand,
          isEntrypoint: u.isEntrypoint,
          isStdLib: u.isStdlib,
          hasIncludeDirectives: u.hasIncludeDirectives,
          folder: u.folder,
        })),
        senderAddress: walletAddress,
      }),
    );

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/source`, {
      method: "POST",
      body: formData,
    });

    if (response.status !== 200) {
      sendAnalyticsEvent(AnalyticsAction.COMPILE_SERVER_ERROR);
      throw new Error(await response.text());
    }

    const result = (await response.json()) as VerifyResult;

    const hints = [];

    if (["unknown_error", "compile_error"].includes(result.compileResult.result)) {
      sendAnalyticsEvent(AnalyticsAction.COMPILE_COMPILATION_ERROR);
      // stdlib
      if (!files.some((u) => u.isStdlib)) {
        Hints.STDLIB_MISSING;
      } else if (!files[0].isStdlib) {
        hints.push(Hints.STDLIB_ORDER);
      }

      if (!files.some((u) => u.isEntrypoint)) {
        hints.push(Hints.ENTRYPOINT_MISSING);
      }

      hints.push(Hints.COMPILER_VERSION);
      hints.push(Hints.REQUIRED_FILES);
      hints.push(Hints.FILE_ORDER);
    }

    if (result.compileResult.result === "not_similar") {
      sendAnalyticsEvent(AnalyticsAction.COMPILE_HASHES_NOT_SIMILAR);
      hints.push(Hints.NOT_SIMILAR);
    }

    if (result.compileResult.result !== "similar") {
      hints.push(Hints.FIFT);
      hints.push(Hints.FIFTLIB);
      hints.push(Hints.SUPPORT_GROUP);
    }

    if (result.compileResult.result === "similar") {
      sendAnalyticsEvent(AnalyticsAction.COMPILE_SUCCESS_HASHES_MATCH);
    }

    let queryId;

    if (result.msgCell) {
      const s = Cell.fromBoc(Buffer.from(result.msgCell))[0].beginParse();
      queryId = s.readUint(64);
    }

    return { result, hints, queryId };
  });

  return mutation;
}

export enum Hints {
  STDLIB_ORDER,
  STDLIB_MISSING,
  FIFTLIB,
  FIFT,
  NOT_SIMILAR,
  COMPILER_VERSION,
  REQUIRED_FILES,
  FILE_ORDER,
  ENTRYPOINT_MISSING,
  SUPPORT_GROUP,
}
