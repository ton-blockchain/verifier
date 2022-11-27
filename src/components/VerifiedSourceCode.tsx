import { useLoadContractSourceCode } from "../lib/useLoadContractSourceCode";

export function VerifiedSourceCode() {
  useLoadContractSourceCode();

  return (
    <div id="myVerifierContainer" style={{ color: "black" }}>
      <div id="myVerifierFiles"></div>
      <div id="myVerifierContent"></div>
    </div>
  );
}
