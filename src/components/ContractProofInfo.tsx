import { useLoadContractProof } from "../lib/useLoadContractProof";
import InfoPiece from "./InfoPiece";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addDefaultLocale(en);

function ContractProofInfo() {
  const { data } = useLoadContractProof();

  const compilerSettings = data!.compilerSettings;

  console.log(data);

  return (
    <>
      <h3>Compiler</h3>
      <InfoPiece label="Compiler" data={data!.compiler!} />
      <InfoPiece label="Func Version" data={compilerSettings?.funcVersion ?? ""} />
      <InfoPiece label="Fift Version" data={compilerSettings?.fiftVersion?.slice(0, 8) ?? ""} />
      <InfoPiece
        label="Fiftlib Version"
        data={compilerSettings?.fiftlibVersion?.slice(0, 8) ?? ""}
      />
      <InfoPiece label="Command" data={compilerSettings?.commandLine!} />
      <InfoPiece label="Verified" data={new TimeAgo("en-US").format(data!.verificationDate!)} />
    </>
  );
}

export default ContractProofInfo;
