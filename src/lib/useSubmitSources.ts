import { useLoadContractInfo } from "./useLoadContractInfo";
import { useFileStore } from "./useFileStore";
import { useCompilerSettingsStore } from "./useCompilerSettingsStore";
import { Cell } from "@ton/ton";
import { FuncCompilerSettings } from "../types/compiler";
import { AnalyticsAction, sendAnalyticsEvent } from "./googleAnalytics";
import create from "zustand";
import { useLoadVerifierRegistryInfo } from "./useLoadVerifierRegistryInfo";
import { useTonAddress } from "@tonconnect/ui-react";
import { useIsTestnet } from "../components/TestnetBar";
import { MutationStatus, useMutation } from "@tanstack/react-query";
import { useMemo } from "react";

export function randomFromArray<T>(arr: readonly T[]) {
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

type VerifierConfig = {
  backendUrls: string[];
};

const testnetVerifiers: Record<string, VerifierConfig> = {
  "verifier.ton.org": {
    backendUrls: ["https://verifier-testnet.tonstudio.io"],
  },
  // "orbs-testnet": {
  //   backendUrls: ["https://ton-source-prod-testnet-1.herokuapp.com"],
  // },
};

const mainnetVerifiers: Record<string, VerifierConfig> = {
  "verifier.ton.org": {
    backendUrls: ["https://verifier-mainnet.tonstudio.io"],
  },
  // "orbs.com": {
  //   backendUrls: [
  //     "https://ton-source-prod-1.herokuapp.com",
  //     "https://ton-source-prod-2.herokuapp.com",
  //     "https://ton-source-prod-3.herokuapp.com",
  //   ],
  // },
};

export function getBackends(verifier: string, isTestnet: boolean): Readonly<string[]> {
  return (isTestnet ? testnetVerifiers : mainnetVerifiers)[verifier]?.backendUrls ?? [];
}

type SubmitSourcesEntry = {
  data?: SubmitSourcesMutationResult;
  error: Error | null;
  isLoading: boolean;
  status: MutationStatus;
  compileStatus: string | null;
};

const createDefaultEntry = (): SubmitSourcesEntry => ({
  data: undefined,
  error: null,
  isLoading: false,
  status: "idle",
  compileStatus: null,
});

type SubmitSourcesStoreState = {
  entries: Record<string, SubmitSourcesEntry>;
  setEntry: (key: string, entry: Partial<SubmitSourcesEntry>) => void;
  resetEntry: (key: string) => void;
  clear: () => void;
};

const useSubmitSourcesStore = create<SubmitSourcesStoreState>((set) => ({
  entries: {},
  setEntry: (key, entry) =>
    set((state) => ({
      entries: {
        ...state.entries,
        [key]: {
          ...createDefaultEntry(),
          ...state.entries[key],
          ...entry,
        },
      },
    })),
  resetEntry: (key) =>
    set((state) => {
      if (!state.entries[key]) {
        return state;
      }
      const next = { ...state.entries };
      delete next[key];
      return { entries: next };
    }),
  clear: () => set({ entries: {} }),
}));

export const clearSubmitSourcesStore = () => {
  useSubmitSourcesStore.getState().clear();
};

export function useSubmitSourcesEntries(contractAddress?: string | null) {
  const entries = useSubmitSourcesStore((state) => state.entries);
  return useMemo(() => {
    if (!contractAddress) {
      return {} as Record<string, SubmitSourcesEntry>;
    }
    const prefix = `${contractAddress}::`;
    return Object.entries(entries).reduce<Record<string, SubmitSourcesEntry>>(
      (acc, [key, entry]) => {
        if (key.startsWith(prefix)) {
          acc[key.slice(prefix.length)] = entry;
        }
        return acc;
      },
      {},
    );
  }, [entries, contractAddress]);
}

type SubmitSourcesMutationResult = {
  result: VerifyResult & { msgCell?: Buffer };
  hints: Hints[];
  queryId?: bigint;
  status: string | null;
};

export type SubmitSourcesMutationVariables = {
  verifiers?: string[];
};

type SubmitSourcesHookReturn = {
  mutate: (variables?: SubmitSourcesMutationVariables | null) => void;
  data: SubmitSourcesMutationResult | undefined;
  error: Error | null;
  isLoading: boolean;
  status: MutationStatus;
  compileStatus: string | null;
  invalidate: () => void;
};

export const DEFAULT_VERIFIER = "verifier.ton.org";

function buildKey(contractAddress?: string, verifier?: string) {
  return `${contractAddress ?? "unknown"}::${verifier ?? DEFAULT_VERIFIER}`;
}

export function useSubmitSources(
  contractAddress: string,
  verifier: string = DEFAULT_VERIFIER,
): SubmitSourcesHookReturn {
  const { data: contractInfo } = useLoadContractInfo();
  const { hasFiles, files } = useFileStore();
  const { compiler, compilerSettings } = useCompilerSettingsStore();
  const walletAddress = useTonAddress();
  const { data: verifierRegistryData } = useLoadVerifierRegistryInfo();
  const isTestnet = useIsTestnet();

  const key = buildKey(contractAddress, verifier);
  const entry = useSubmitSourcesStore((state) => state.entries[key] ?? createDefaultEntry());
  const setEntry = useSubmitSourcesStore((state) => state.setEntry);
  const resetEntry = useSubmitSourcesStore((state) => state.resetEntry);

  const submitToVerifier = async (targetVerifier: string, entryKey: string) => {
    const verifierRegistryConfig = Object.values(verifierRegistryData ?? {}).find(
      (v) => v.name === targetVerifier,
    );
    if (!verifierRegistryConfig) {
      throw new Error(`Unknown verifier: ${targetVerifier}`);
    }

    const backends = getBackends(targetVerifier, isTestnet);
    if (!backends.length) {
      throw new Error(`No backends configured for ${targetVerifier}`);
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
        knownContractHash: contractInfo!.codeCellToCompileBase64,
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

    const backend = randomFromArray(backends);

    const response = await fetch(`${backend}/source`, {
      method: "POST",
      body: formData,
    });

    if (response.status !== 200) {
      sendAnalyticsEvent(AnalyticsAction.COMPILE_SERVER_ERROR);
      throw new Error(`Error compiling on ${backend} ${await response.text()}`);
    }

    const result = (await response.json()) as VerifyResult;

    const hints: Hints[] = [];

    if (["unknown_error", "compile_error"].includes(result.compileResult.result)) {
      sendAnalyticsEvent(AnalyticsAction.COMPILE_COMPILATION_ERROR);
      if (!files.some((u) => u.isStdlib)) {
        hints.push(Hints.STDLIB_MISSING);
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
    } else {
      sendAnalyticsEvent(AnalyticsAction.COMPILE_SUCCESS_HASHES_MATCH);
    }

    let queryId;
    let compileStatusMessage: string | null = null;
    let msgCell: Buffer | undefined = result.msgCell;

    const updateCompileStatus = (status: string) => {
      compileStatusMessage = status;
      setEntry(entryKey, { compileStatus: status });
    };

    if (result.msgCell) {
      const totalSignatures = verifierRegistryConfig.quorum;
      let remainingSignatures = totalSignatures - 1;
      const signatures = new Set([backend]);

      while (remainingSignatures > 0) {
        updateCompileStatus(
          `Compile successful. Collected ${totalSignatures - remainingSignatures}/${totalSignatures}`,
        );

        const nextBackend = randomFromArray(backends.filter((b) => !signatures.has(b)));
        if (!nextBackend) {
          throw new Error("Not enough backends to collect signatures");
        }

        const signResponse: Response = await fetch(`${nextBackend}/sign`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messageCell: msgCell,
          }),
        });

        if (signResponse.status !== 200) {
          sendAnalyticsEvent(AnalyticsAction.SIGN_SERVER_ERROR);
          throw new Error(
            `Error collecting signatures from ${nextBackend} ${await signResponse.text()}`,
          );
        }

        sendAnalyticsEvent(AnalyticsAction.SIGN_SERVER_SUCCESS);
        const json = await signResponse.json();
        msgCell = json.msgCell;
        remainingSignatures--;
        signatures.add(nextBackend);
      }

      updateCompileStatus(`Compile successful. Collected ${totalSignatures}/${totalSignatures}`);

      const s = Cell.fromBoc(Buffer.from(msgCell!))[0].beginParse();
      queryId = s.loadUintBig(64);
    }

    return {
      result: {
        ...result,
        msgCell,
      },
      hints,
      queryId,
      status: compileStatusMessage,
    };
  };

  const mutation = useMutation({
    mutationKey: ["submitSources", contractAddress],
    mutationFn: async (variables?: SubmitSourcesMutationVariables) => {
      if (!contractAddress) return {};
      if (!contractInfo?.codeCellToCompileBase64) return {};
      if (!hasFiles()) return {};
      if (!verifierRegistryData) {
        throw new Error("Verifier registry is not loaded");
      }
      if (!walletAddress) {
        throw new Error("Wallet is not connected");
      }

      const uniqueVerifiers = Array.from(
        new Set((variables?.verifiers?.length ? variables.verifiers : [verifier]).filter(Boolean)),
      );

      const results: Record<string, SubmitSourcesMutationResult | undefined> = {};

      for (const targetVerifier of uniqueVerifiers) {
        const entryKey = buildKey(contractAddress, targetVerifier);
        setEntry(entryKey, {
          status: "pending",
          isLoading: true,
          error: null,
          compileStatus: null,
          data: undefined,
        });

        try {
          const result = await submitToVerifier(targetVerifier, entryKey);
          if (result) {
            results[targetVerifier] = result;
            setEntry(entryKey, {
              data: result,
              status: "success",
              isLoading: false,
            });
          } else {
            setEntry(entryKey, {
              status: "error",
              isLoading: false,
            });
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error("Unknown error");
          setEntry(entryKey, {
            error,
            status: "error",
            isLoading: false,
          });
        }
      }

      return results;
    },
  });

  const triggerMutation = (variables?: SubmitSourcesMutationVariables | null) => {
    mutation.mutate(variables ?? undefined);
  };

  const invalidate = () => {
    resetEntry(key);
  };

  return {
    mutate: triggerMutation,
    data: entry.data,
    error: entry.error,
    isLoading: entry.isLoading,
    status: entry.status,
    compileStatus: entry.compileStatus,
    invalidate,
  };
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
