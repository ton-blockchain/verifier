import { useLoadContractSourceCode } from "../lib/useLoadContractSourceCode";
import React from "react";

interface VerifiedSourceCodeProps {
  button: React.ReactNode;
}

export function VerifiedSourceCode({ button }: VerifiedSourceCodeProps) {
  useLoadContractSourceCode();

  return (
    <div id="myVerifierContainer" style={{ color: "black" }}>
      <div id="myVerifierFiles"></div>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div id="myVerifierContent"></div>
        <div style={{ position: "absolute", top: -74, right: -25 }}>{button}</div>
      </div>
    </div>
  );
}
