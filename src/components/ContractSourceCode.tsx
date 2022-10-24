import "./ContractSourceCode.css";
import { useLoadContractSourceCode } from "../lib/useLoadContractSourceCode";
import Container from "./Container";

function ContractSourceCode() {
  const { hasOnchainProof } = useLoadContractSourceCode();

  return (
    <Container>
      <h3 style={{ textAlign: "center" }}>Source Code</h3>
      {hasOnchainProof && (
        <div id="myVerifierContainer" style={{ height: 800, color: "black" }}>
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
        </div>
      )}
      {!hasOnchainProof && <div>TODO add decompiled here</div>}
    </Container>
  );
}

export default ContractSourceCode;
