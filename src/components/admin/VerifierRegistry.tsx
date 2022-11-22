import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import BN from "bn.js";
import { Address, Cell } from "ton";
import { getClient } from "../../lib/getClient";
import { makeGetCall } from "../../lib/makeGetCall";
import InfoPiece from "../InfoPiece";

function num2ip(num: BN) {
  let d = num.toBuffer();
  return [d[0].toString(), d[1].toString(), d[2].toString(), d[3].toString()].join(".");
}

function useLoadVerifierRegistryInfo() {
  const address = Address.parse(import.meta.env.VITE_VERIFIER_REGISTRY);
  return useQuery(["verifierRegistry", address], async () => {
    const tc = await getClient();
    const verifierConfig = await makeGetCall(
      address,
      "get_verifiers",
      [],
      (s) =>
        (s[0] as Cell).beginParse().readDict(256, (s) => ({
          admin: s.readAddress()!.toFriendly(),
          quorum: s.readInt(8).toString(),
          pubKeyEndpoints: Object.fromEntries(
            Array.from(s.readDict(256, (pkE) => num2ip(pkE.readUint(32))).entries()).map(
              ([k, v]) => [new BN(k).toBuffer().toString("base64"), v.toString()],
            ),
          ),
          name: s.readRef().readRemainingBytes().toString(),
          url: s.readRef().readRemainingBytes().toString(),
        })),
      tc,
    );

    return Array.from(verifierConfig.values()).map((v) => {
      return v;
    });
  });
}

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
