import InfoPiece from "../InfoPiece";
import { useLoadVerifierRegistryInfo, VerifierConfig } from "../../lib/useLoadVerifierRegistryInfo";
import BN from "bn.js";
import { Cell, beginDict, beginCell, toNano } from "ton";
import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import { useWalletConnect } from "../../lib/useWalletConnect";
import Button from "../Button";
import { toSha256Buffer } from "../../lib/useLoadContractProof";

export const OperationCodes = {
  removeVerifier: 0x19fa5637,
  updateVerifier: 0x6002d61a,
  forwardMessage: 0x75217758,
};

function sha256BN(name: string) {
  return new BN(toSha256Buffer(name));
}

function ip2num(ip: string) {
  let d = ip.split(".");
  return ((+d[0] * 256 + +d[1]) * 256 + +d[2]) * 256 + +d[3];
}

function updateVerifier(params: {
  queryId?: number;
  id: BN;
  quorum: number;
  endpoints: Map<BN, number>;
  name: string;
  marketingUrl: string;
}): Cell {
  let msgBody = new Cell();
  msgBody.bits.writeUint(OperationCodes.updateVerifier, 32);
  msgBody.bits.writeUint(params.queryId || 0, 64);
  msgBody.bits.writeUint(params.id, 256);
  msgBody.bits.writeUint(params.quorum, 8);

  let e = beginDict(256);
  params.endpoints.forEach(function (val: number, key: BN) {
    e.storeCell(key, beginCell().storeUint(val, 32).endCell());
  });

  msgBody.bits.writeBit(true);
  msgBody.refs.push(e.endCell());
  msgBody.refs.push(beginCell().storeBuffer(Buffer.from(params.name)).endCell());
  msgBody.refs.push(beginCell().storeBuffer(Buffer.from(params.marketingUrl)).endCell());

  return msgBody;
}

function UpdateVerifier({ verifier }: { verifier: VerifierConfig }) {
  const [open, setOpen] = useState(false);
  const { requestTXN } = useWalletConnect();
  const { data, isLoading } = useLoadVerifierRegistryInfo();

  const [value, setValue] = useState(
    JSON.stringify(
      {
        quorum: verifier.quorum,
        pubKeyEndpoints: verifier.pubKeyEndpoints,
        name: verifier.name,
        url: verifier.url,
      },
      null,
      3,
    ),
  );

  return (
    <>
      <Button
        style={{ marginTop: 8 }}
        text={"Update config"}
        onClick={() => {
          setOpen(true);
        }}
      />
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}>
        <DialogTitle>{"s"}</DialogTitle>
        <DialogContent sx={{ width: 1000 }}>
          <TextField
            multiline
            autoFocus
            margin="dense"
            id="name"
            label="JSON"
            fullWidth
            variant="standard"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            text={"DOIT"}
            onClick={() => {
              const val = JSON.parse(value) as VerifierConfig;

              requestTXN(
                import.meta.env.VITE_VERIFIER_REGISTRY,
                toNano(0.01),
                updateVerifier({
                  id: sha256BN(val.name),
                  quorum: parseInt(val.quorum),
                  endpoints: new Map<BN, number>(
                    Object.entries(val.pubKeyEndpoints).map(([pubKey, ip]) => [
                      new BN(Buffer.from(pubKey, "base64")),
                      ip2num(ip),
                    ]),
                  ),
                  name: val.name,
                  marketingUrl: val.url,
                }),
              );
            }}
          />
        </DialogActions>
      </Dialog>
    </>
  );
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
            <>
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
              <UpdateVerifier verifier={v} />
            </>
          );
        })}
      </>
    </div>
  );
}
