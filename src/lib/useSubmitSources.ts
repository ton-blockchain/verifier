import { useLoadContractInfo } from "./useLoadContractInfo";
import { useFileStore } from "./useFileStore";
import { useCompilerSettingsStore } from "./useCompilerSettingsStore";
import { useParams } from "react-router-dom";
import { useCustomMutation } from "./useCustomMutation";
import { Cell } from "ton";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useContractAddress } from "./useContractAddress";

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
  return new Blob([JSON.stringify(json)], {
    type: "application/json",
  });
}

export function useSubmitSources() {
  const { contractAddress } = useContractAddress();
  const { data: contractInfo } = useLoadContractInfo();
  const { hasFiles, files } = useFileStore();
  const { compiler, compilerSettings } = useCompilerSettingsStore();

  const mutation = useCustomMutation(["submitSources"], async () => {
    if (!contractAddress) return;
    if (!contractInfo?.hash) return;
    if (!hasFiles()) return;

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
        senderAddress: "EQDerEPTIh0O8lBdjWc6aLaJs5HYqlfBN2Ruj1lJQH_6vcaZ", //senderAddress,
      }),
    );

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/source`, {
      method: "POST",
      body: formData,
    });

    if (response.status !== 200) {
      throw new Error(await response.text());
    }

    const result = (await response.json()) as VerifyResult;

    const hints = [];

    if (["unknown_error", "compile_error"].includes(result.compileResult.result)) {
      // stdlib
      if (!files.some((u) => u.isStdlib)) {
        hints.push("You can try to add stdlib.fc to your sources.");
      } else if (!files[0].isStdlib) {
        hints.push(
          "stdlib.fc should usually be the first file in the list (unless it's imported from another file)",
        );
      }

      if (!files.some((u) => u.isEntrypoint)) {
        hints.push(
          "There usually should be at least one file containing an entrypoint (recv_internal, main)",
        );
      }

      hints.push("Try to use the same compiler version as the contract was compiled with");
      hints.push("Make sure all required files are included in the command line");
      hints.push("Make sure all files in the command line are in the correct order");
    }

    if (result.compileResult.result === "not_similar") {
      hints.push(
        "Source code compiles correctly but does not match the on-chain contract hash. Make sure you are using the correct compiler version, command line and file order.",
      );
    }

    let queryId;

    if (result.msgCell) {
      const s = Cell.fromBoc(Buffer.from(result.msgCell))[0].beginParse();
      console.log(s.readUint(32).toString("hex"));
      queryId = s.readUint(64);
    }

    return { result, hints, queryId };
  });

  return mutation;
}
