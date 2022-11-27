import { useLoadContractSourceCode } from "../lib/useLoadContractSourceCode";

export function VerifiedSourceCode() {
  const { hasOnchainProof } = useLoadContractSourceCode();

  return (
    <div id="myVerifierContainer" style={{ height: 500, color: "black" }}>
      <div id="myVerifierFiles"></div>
      <div id="myVerifierContent"></div>
    </div>
  );
}
