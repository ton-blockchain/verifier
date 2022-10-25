import { useSubmitSources } from "../lib/useSubmitSources";
import InfoPiece from "./InfoPiece";
import { useLoadContractInfo } from "../lib/useLoadContractInfo";
export function CompileOutput() {
  const { data: submitSourcesData, error } = useSubmitSources();
  const { data: contractInfoData } = useLoadContractInfo();

  return (
    <div>
      <h3>Result</h3>
      {["similar"].includes(
        submitSourcesData?.compileResult?.result ?? ""
      ) && (
        <div>
          Hashes match
        </div>
      )}

      {["not_similar"].includes(
        submitSourcesData?.compileResult?.result ?? ""
      ) && (
        <div>
          <h4>❌ Hashes are not similar</h4>
          <InfoPiece
            label="Contract hash"
            data={contractInfoData?.hash ?? ""}
          />
          <InfoPiece
            label="Compile output hash"
            data={submitSourcesData?.compileResult?.hash ?? ""}
          />
        </div>
      )}

      {["unknown_error", "compile_error"].includes(
        submitSourcesData?.compileResult?.result ?? ""
      ) && <h4>Compile error</h4>}

      {submitSourcesData?.compileResult?.error && (
        <pre
          style={{
            backgroundColor: "#e3e3e3",
            padding: 16,
            borderRadius: 20,
            overflow: "auto",
            maxHeight: 300,
          }}
        >
          <code>{submitSourcesData.compileResult.error}</code>
        </pre>
      )}
      {error && <h4>❌ {error.toString()}</h4>}
    </div>
  );
}
