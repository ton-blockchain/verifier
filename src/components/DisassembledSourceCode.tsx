import { useLoadContractInfo } from "../lib/useLoadContractInfo";
import React, { useEffect, useRef } from "react";
import "highlight.js/styles/atom-one-light.css";
import { useMediaQuery, useTheme } from "@mui/material";
import { highlightElement } from "../lib/highlight";

interface DisassembledSourceCodeProps {
  button: React.ReactNode;
}

export function DisassembledSourceCode({ button }: DisassembledSourceCodeProps) {
  const { data: contractInfo } = useLoadContractInfo();
  const theme = useTheme();
  const headerSpacings = useMediaQuery(theme.breakpoints.down("lg"));
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      highlightElement(ref.current);
    }
  }, [contractInfo?.decompiled]);

  return (
    <pre
      style={{
        overflow: "auto",
        height: 800,
        marginTop: 0,
        lineHeight: "25px",
        fontSize: 14,
        paddingTop: "0.5em",
        fontFamily: "monospace",
      }}>
      <code className="language-fift" style={{ background: "#fff", display: "flex" }}>
        <div
          style={{
            textAlign: "right",
            color: "#728a96",
            paddingLeft: headerSpacings ? 0 : 20,
          }}>
          {contractInfo?.decompiled
            ?.trim()
            .split("\n")
            .map((_, i) => i + 1)
            .join("\n")}
        </div>
        <div style={{ background: "transparent", paddingLeft: 20 }} ref={ref}>
          {contractInfo?.decompiled}
        </div>
      </code>
      {button}
    </pre>
  );
}
