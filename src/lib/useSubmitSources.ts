import { useLoadContractInfo } from "./useLoadContractInfo";
import { useFileStore } from "./useFileStore";
import { useCompilerSettingsStore } from "./useCompilerSettingsStore";
import { useParams } from "react-router-dom";
import { useCustomMutation } from "./useCustomMutation";

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
};

function jsonToBlob(json: Record<string, any>): Blob {
  return new Blob([JSON.stringify(json)], { type: "application/json" });
}

// TODO from env
const server =
  process.env.NODE_ENV === "production"
    ? "https://ton-source-staging.herokuapp.com"
    : "http://localhost:3003";

export function useSubmitSources() {
  const { contractAddress } = useParams();
  const { data: contractInfo } = useLoadContractInfo();
  const { hasFiles, files } = useFileStore();
  const { compiler, version, commandLine } = useCompilerSettingsStore();

  return useCustomMutation(["submitSources"], async () => {
    if (!contractAddress) return;
    if (!contractInfo?.hash) return;
    if (!hasFiles()) return;

    const formData = new FormData();

    for (const f of files) {
      formData.append(
        (f.folder ? f.folder + "/" : "") + f.fileObj.name,
        f.fileObj
      );
    }

    formData.append(
      "json",
      jsonToBlob({
        compiler,
        version,
        compileCommandLine: commandLine, // TODO change on server
        knownContractAddress: contractAddress,
        knownContractHash: contractInfo.hash,
        sources: files.map((u) => ({
          includeInCommand: u.includeInCommand,
          // isEntrypoint: u.isEntrypoint,
          // isStdLib: u.isStdlib,
          // hasIncludeDirectives: u.hasIncludeDirectives,
          folder: u.folder,
        })),
        senderAddress: "EQDerEPTIh0O8lBdjWc6aLaJs5HYqlfBN2Ruj1lJQH_6vcaZ", //senderAddress,
      })
    );

    const response = await fetch(`${server}/source`, {
      method: "POST",
      body: formData,
    });

    if (response.status !== 200) {
      throw new Error(await response.text());
    }

    return (await response.json()) as VerifyResult;
  });
}
