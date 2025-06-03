import { useLoadContractInfo } from "./useLoadContractInfo";
import { useFileStore } from "./useFileStore";
import { useCompilerSettingsStore } from "./useCompilerSettingsStore";
import { useCustomMutation } from "./useCustomMutation";
import { Cell } from "ton";
import { useContractAddress } from "./useContractAddress";
import { FuncCompilerSettings } from "@ton-community/contract-verifier-sdk";
import { AnalyticsAction, sendAnalyticsEvent } from "./googleAnalytics";
import create from "zustand";
import { useLoadVerifierRegistryInfo } from "./useLoadVerifierRegistryInfo";
import { useTonAddress } from "@tonconnect/ui-react";
import { useRemoteConfig } from "./useRemoteConfig";

export function randomFromArray<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

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

const isTestnet = window.isTestnet;

const useSubmitSourcesStatusStore = create<{
  status: string | null;
  setStatus: (status: string) => void;
  clear: () => void;
}>((set) => ({
  status: null,
  setStatus: (status) => set({ status }),
  clear: () => set({ status: null }),
}));

export function useBackends() {
  const { data: remoteConfig } = useRemoteConfig();

  let backends: string[] = [];

  if (!!import.meta.env.VITE_BACKEND_URL_OVERRIDE) {
    backends = import.meta.env.VITE_BACKEND_URL_OVERRIDE.split(",");
  } else if (isTestnet) {
    backends = remoteConfig.backendsTestnet;
  } else {
    backends = remoteConfig.backends;
  }

  return backends;
}

export function useSubmitSources() {
  const { contractAddress } = useContractAddress();
  const { data: contractInfo } = useLoadContractInfo();
  const { hasFiles, files } = useFileStore();
  const { compiler, compilerSettings } = useCompilerSettingsStore();
  const walletAddress = useTonAddress();
  const { clear, setStatus, status } = useSubmitSourcesStatusStore();
  const { data: verifierRegistryData } = useLoadVerifierRegistryInfo();
  const backends = useBackends();

  const verifierRegistryConfig = verifierRegistryData?.find((v) => v.name === window.verifierId);

  const mutation = useCustomMutation(["submitSources"], async () => {
    if (!contractAddress) return;
    if (!contractInfo?.codeCellToCompileBase64) return;
    if (!hasFiles()) return;
    if (!verifierRegistryConfig) return;
    if (!walletAddress) {
      throw new Error("Wallet is not connected");
    }
    if (backends.length === 0) return;

    clear();

    const totalSignatures = verifierRegistryConfig.quorum;
    let remainingSignatures = totalSignatures;

    let msgCell: Buffer | undefined;

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
        knownContractHash: contractInfo.codeCellToCompileBase64,
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

    const backend = backends[Math.floor(Math.random() * backends.length)];

    const response = await fetch(`${backend}/source`, {
      method: "POST",
      body: formData,
    });

    if (response.status !== 200) {
      sendAnalyticsEvent(AnalyticsAction.COMPILE_SERVER_ERROR);
      throw new Error(`Error compiling on ${backend} ${await response.text()}`);
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
      hints.push(Hints.SUPPORT_GROUP);
    }

    if (result.compileResult.result === "similar") {
      sendAnalyticsEvent(AnalyticsAction.COMPILE_SUCCESS_HASHES_MATCH);
    }

    let queryId;

    if (result.msgCell) {
      remainingSignatures--;
      const signatures = new Set([backend]);

      msgCell = result.msgCell!;

      while (remainingSignatures) {
        setStatus(
          `Compile successful. Collected ${
            totalSignatures - remainingSignatures
          }/${totalSignatures}`,
        );
        const nextBackend = randomFromArray(backends.filter((b) => !signatures.has(b)));
        if (!nextBackend) {
          throw new Error("Not enough backends to collect signatures");
        }

        console.log("Backends used: " + [...signatures], "; next backend", nextBackend);

        const response: Response = await fetch(`${nextBackend}/sign`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messageCell: msgCell,
          }),
        });

        if (response.status !== 200) {
          sendAnalyticsEvent(AnalyticsAction.SIGN_SERVER_ERROR);
          throw new Error(
            `Error collecting signatures from ${nextBackend} ${await response.text()}`,
          );
        }

        sendAnalyticsEvent(AnalyticsAction.SIGN_SERVER_SUCCESS);
        const json = await response.json();

        msgCell = json.msgCell;
        remainingSignatures--;
      }

      setStatus(
        `Compile successful. Collected ${totalSignatures - remainingSignatures}/${totalSignatures}`,
      );

      const s = Cell.fromBoc(Buffer.from(result.msgCell))[0].beginParse();
      queryId = s.loadUint(64);
    }

    return {
      result: {
        ...result,
        msgCell,
      },
      hints,
      queryId,
      status,
    };
  });

  return { ...mutation, compileStatus: status };
}

export enum Hints {
  STDLIB_ORDER,
  STDLIB_MISSING,
  NOT_SIMILAR,
  COMPILER_VERSION,
  REQUIRED_FILES,
  FILE_ORDER,
  ENTRYPOINT_MISSING,
  SUPPORT_GROUP,
}
