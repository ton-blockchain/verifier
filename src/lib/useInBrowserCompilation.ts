import { compileFunc, compilerVersion, SourceEntry } from "@ton-community/func-js";
import { Cell } from "ton";
import { isWebAssemblySupported, verifyCompilerVersion } from "../utils/generalUtils";
import { useLoadContractProof } from "./useLoadContractProof";

export function useInBrowserCompilation() {
  const { data } = useLoadContractProof();

  const getVersion = async () => await compilerVersion();

  const verifyContract = async () => {
    const sources: SourceEntry[] = [];

    data?.files?.forEach((file, i) => {
      sources.push({ filename: file.name, content: file.content.slice(0, 50) });
    });

    console.log(sources);

    let result = await compileFunc({
      sources: sources.reverse(),
    });

    if (result.status === "error") {
      console.error(result.message);
      return;
    }

    let codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0];

    console.log(codeCell);
  };

  const isVerificationEnabled = () =>
    !(!isWebAssemblySupported() || !verifyCompilerVersion() || data?.compiler !== "func");

  return { getVersion, verifyContract, isVerificationEnabled };
}
