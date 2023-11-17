import InfoPiece from "../InfoPiece";
import { useLoadVerifierRegistryInfo } from "../../lib/useLoadVerifierRegistryInfo";
import { Dictionary, beginCell, toNano, DictionaryValue, Slice } from "ton";
import { toBigIntBE } from "bigint-buffer";
import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import Button from "../Button";
import { toSha256Buffer } from "../../lib/useLoadContractProof";
import { useRequestTXN } from "../../hooks";
import { Verifier } from "../../lib/wrappers/verifier-registry";

export const OperationCodes = {
  removeVerifier: 0x19fa5637,
  updateVerifier: 0x6002d61a,
  forwardMessage: 0x75217758,
};

function sha256BN(name: string) {
  return toBigIntBE(toSha256Buffer(name));
}

function ip2num(ip: string) {
  let d = ip.split(".");
  return ((+d[0] * 256 + +d[1]) * 256 + +d[2]) * 256 + +d[3];
}

function createSliceValue(): DictionaryValue<Slice> {
  return {
    serialize: (src, buidler) => {
      buidler.storeSlice(src);
    },
    parse: (src) => {
      return src;
    },
  };
}

function updateVerifier(params: {
  queryId?: number;
  id: bigint;
  quorum: number;
  endpoints: Map<bigint, number>;
  name: string;
  marketingUrl: string;
}) {
  let msgBody = beginCell();
  msgBody.storeUint(OperationCodes.updateVerifier, 32);
  msgBody.storeUint(params.queryId || 0, 64);
  msgBody.storeUint(params.id, 256);
  msgBody.storeUint(params.quorum, 8);

  let e = Dictionary.empty(Dictionary.Keys.BigUint(256), createSliceValue());
  params.endpoints.forEach(function (val: number, key: bigint) {
    e.set(key, beginCell().storeUint(val, 32).endCell().beginParse());
  });

  msgBody.storeDict(e);
  msgBody.storeRef(beginCell().storeBuffer(Buffer.from(params.name)).endCell());
  msgBody.storeRef(beginCell().storeBuffer(Buffer.from(params.marketingUrl)).endCell());

  return msgBody.endCell();
}

function UpdateVerifier({ verifier }: { verifier: Verifier }) {
  const [open, setOpen] = useState(false);
  const requestTXN = useRequestTXN();
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
              const val = JSON.parse(value) as Verifier;

              requestTXN(
                window.verifierRegistryAddress,
                toNano("0.01"),
                updateVerifier({
                  id: sha256BN(val.name),
                  quorum: val.quorum,
                  endpoints: new Map<bigint, number>(
                    Object.entries(val.pubKeyEndpoints).map(([pubKey, ip]) => [
                      toBigIntBE(Buffer.from(pubKey, "base64")),
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
      <InfoPiece label="Address" data={window.verifierRegistryAddress} />
      <>
        {isLoading && "Loading..."}
        {data?.map((v) => {
          return (
            <>
              <div
                key={v.name}
                style={{ background: "#00000011", padding: "2px 20px", marginTop: 10 }}>
                <h3>{v.name}</h3>
                <InfoPiece label="Admin" data={v.admin.toString()} />
                <InfoPiece label="Quorum" data={String(v.quorum)} />
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
