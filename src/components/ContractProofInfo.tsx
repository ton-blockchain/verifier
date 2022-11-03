import "./ContractProof.css";
import Container from "./Container";
import { useLoadContractProof } from "../lib/useLoadContractProof";
import InfoPiece from "./InfoPiece";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addDefaultLocale(en);

function ContractProofInfo() {
  const { data } = useLoadContractProof();

  return (
    <Container className="ContractProof">
      <h3 style={{ textAlign: "center" }}>Compiler</h3>
      <InfoPiece label="Compiler" data={data!.compiler!} />
      <InfoPiece label="Version" data={data!.version!} />
      <InfoPiece label="Command" data={data!.commandLine!} />
      <InfoPiece
        label="Verified"
        data={new TimeAgo("en-US").format(data!.verificationDate!)}
      />
    </Container>
  );
}

export default ContractProofInfo;
