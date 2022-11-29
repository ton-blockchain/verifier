import { useLoadContractInfo } from "../lib/useLoadContractInfo";
import hljs from "highlight.js/lib/core";
// @ts-ignore
import hljsDefine from "highlightjs-func";
import { useEffect, useRef } from "react";
import "highlight.js/styles/atom-one-light.css";
hljsDefine(hljs);

export function DisassembledSourceCode() {
  const { data: contractInfo } = useLoadContractInfo();

  const ref = useRef<any>(null);

  useEffect(() => {
    hljs.highlightElement(ref.current);
  }, [contractInfo?.decompiled, ref.current]);

  return (
    <pre
      style={{
        overflow: "auto",
        maxHeight: 800,
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
            paddingLeft: 20,
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
    </pre>
  );
}
