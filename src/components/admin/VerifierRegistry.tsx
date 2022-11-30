import InfoPiece from "../InfoPiece";
import { useLoadVerifierRegistryInfo } from "../../lib/useLoadVerifierRegistryInfo";

export function VerifierRegistry() {
  const { data, isLoading } = useLoadVerifierRegistryInfo();
  return (
    <div style={{ padding: "20px 40px", background: "#00000011" }}>
      <div
        style={{
          display: "flex",
          gap: 30,
          alignItems: "center",
        }}>
        <h1>Verifier Registry</h1>
      </div>
      <InfoPiece label="Address" data={import.meta.env.VITE_VERIFIER_REGISTRY} />
      <>
        {isLoading && "Loading..."}
        {data?.map((v) => {
          return (
            <div
              key={v.name}
              style={{ background: "#00000011", padding: "2px 20px", marginTop: 10 }}>
              <h3>{v.name}</h3>
              <InfoPiece label="Admin" data={v.admin} />
              <InfoPiece label="Quorum" data={v.quorum} />
              <InfoPiece label="Url" data={v.url} />
              <br />
              <div>Public Key Endpoints</div>
              {Object.entries(v.pubKeyEndpoints).map(([k, v2]) => {
                return <InfoPiece key={k} label={k} data={`${v2}`} />;
              })}
            </div>
          );
        })}
      </>
    </div>
  );
}
