import { useLoadContractSourceCode } from "../lib/useLoadContractSourceCode";

export function VerifiedSourceCode() {
  const { hasOnchainProof } = useLoadContractSourceCode();
  
  return <div id="myVerifierContainer" style={{ height: 800, color: "black" }}>
    <div id="myVerifierFiles"></div>
    <div id="myVerifierContent"></div>
    <div className="myVerificationProof">
      <h3 style={{ textAlign: "center" }}>
        How is this contract verified?
      </h3>
      <div style={{ opacity: 0.5 }}>
        This source code compiles to the same exact bytecode that is found
        on-chain. ...
      </div>
    </div>
  </div>;
}
