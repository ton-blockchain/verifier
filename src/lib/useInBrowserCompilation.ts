import { compileFunc, compilerVersion } from "@ton-community/func-js";
import { Cell } from "ton";
import { isWebAssemblySupported, verifyCompilerVersion } from "../utils/generalUtils";
import { useLoadContractProof } from "./useLoadContractProof";

export function useInBrowserCompilation() {
  const { data, isLoading } = useLoadContractProof();

  const getVersion = async () => await compilerVersion();

  const verifyContract = async () => {
    if (!isLoading) {
      const titles = [...(data?.files?.map((item: any) => item?.name) || [])];
      const content = [...(data?.files?.map((item: any) => item?.content) || [])];
      const sources = titles.reduce((acc, k, i) => ({ ...acc, [k]: content[i] }), {});
      console.log(sources);
      let result = await compileFunc({
        sources,
      });

      if (result.status === "error") {
        console.error(result.message);
        return;
      }

      let codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0];

      console.log(codeCell);
    }
  };

  const isVerificationEnabled = () =>
    !(!isWebAssemblySupported() || !verifyCompilerVersion() || data?.compiler !== "func");

  return { getVersion, verifyContract, isVerificationEnabled };
}
