import InfoPiece from "../InfoPiece";
import { useLoadVerifierRegistryInfo } from "../../lib/useLoadVerifierRegistryInfo";
import { Dictionary, beginCell, toNano, DictionaryValue, Slice, Address } from "ton";
import { toBigIntBE } from "bigint-buffer";
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField as MuiTextField,
  DialogActions,
  Stack,
  Grid,
  Typography,
  Divider,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import Button from "../Button";
import { toSha256Buffer } from "../../lib/useLoadContractProof";
import { useRequestTXN } from "../../hooks";
import { Verifier } from "../../lib/wrappers/verifier-registry";
import { useFieldArray, useForm } from "react-hook-form";
import { TextField } from "./form/TextField";

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

type VerifierRegistryForm = {
  quorum: string;
  name: string;
  url: string;
  pubKeyEndpoints: { pubKey: string; ip: string }[];
};

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
        <DialogTitle>Update Verifier</DialogTitle>
        <DialogContent sx={{ width: 1000 }}>
          <MuiTextField
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
            text={"Send TXN"}
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

function VerifierRegsitryForm({ verifier, altColor }: { verifier: Verifier; altColor: boolean }) {
  const requestTXN = useRequestTXN();

  const defaultPubKeyEndpoints = useMemo(
    () =>
      Object.entries(verifier.pubKeyEndpoints).map(([pubKey, ip]) => ({
        pubKey,
        ip,
      })),
    [verifier.pubKeyEndpoints],
  );

  const form = useForm<VerifierRegistryForm>({
    defaultValues: {
      quorum: verifier.quorum.toString() || "",
      name: verifier.name || "",
      url: verifier.url || "",
      pubKeyEndpoints: defaultPubKeyEndpoints || [],
    },
  });

  async function onSubmit(values: VerifierRegistryForm) {
    console.log(values);

    // validate values
    if (!values.name) {
      form.setError("name", { message: "Name is required" });
      return;
    }

    if (!values.url) {
      form.setError("url", { message: "Url is required" });
      return;
    }

    if (!values.quorum) {
      form.setError("quorum", { message: "Quorum is required" });
      return;
    }

    if (!values.pubKeyEndpoints) {
      form.setError("pubKeyEndpoints", { message: "PubKeyEndpoints is required" });
      return;
    }

    try {
      const result = await requestTXN(
        window.verifierRegistryAddress,
        toNano("0.01"),
        updateVerifier({
          id: sha256BN(values.name),
          quorum: Number(values.quorum),
          endpoints: new Map<bigint, number>(
            values.pubKeyEndpoints.map(({ pubKey, ip }) => [
              toBigIntBE(Buffer.from(pubKey, "base64")),
              ip2num(ip),
            ]),
          ),
          name: values.name,
          marketingUrl: values.url,
        }),
      );
      if (result === "rejected") {
        form.setError("root", { message: `Failed to update config of ${values.name}` });
      }
    } catch (err) {
      let errMessage = `Failed to update config of ${values.name}`;

      if ("message" in (err as Error)) {
        errMessage = (err as Error).message;
      }

      form.setError("root", { message: errMessage });
    }
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pubKeyEndpoints",
  });

  return (
    <form id={verifier.admin.toString()} onSubmit={form.handleSubmit(onSubmit)}>
      <Stack
        spacing={4}
        px={4}
        py={6}
        style={{ backgroundColor: altColor ? "#eeeeef" : "transparent" }}>
        {!form.formState.isValid && (
          <Alert severity="error">
            {Object.entries(form.formState.errors).map(([key, value]) => {
              return <div key={key}>{value.message}</div>;
            })}
          </Alert>
        )}
        <h3 style={{ margin: 0 }}>{form.getValues("name")}</h3>
        <InfoPiece label="Admin" data={verifier.admin.toString()} />
        <TextField label="Url" name="url" control={form.control} />
        <TextField label="Quorum" name="quorum" control={form.control} />
        <Stack spacing={2} alignItems="flex-start">
          <Stack direction="row" spacing={4} alignItems="center">
            <h4>Public Key Endpoints</h4>
            <Button
              size="small"
              text="Add"
              onClick={() => {
                append({ pubKey: "", ip: "" });
              }}
            />
          </Stack>
          {fields.map((field, index) => (
            <Grid key={field.id} container alignItems="center" gap={2} wrap="nowrap">
              <Grid item xs={6}>
                <TextField
                  label={`PubKey-${index}`}
                  name={`pubKeyEndpoints.${index}.pubKey`}
                  control={form.control}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label={`IP-${index}`}
                  name={`pubKeyEndpoints.${index}.ip`}
                  control={form.control}
                />
              </Grid>
              <Grid item xs={1}>
                <Button text="Remove" onClick={() => remove(index)} />
              </Grid>
            </Grid>
          ))}
        </Stack>
        <Button text="Update config" type="submit" disabled={!form.formState.isDirty} />
      </Stack>
    </form>
  );
}

export function VerifierRegistry() {
  const { data, isLoading } = useLoadVerifierRegistryInfo();
  const requestTXN = useRequestTXN();

  return (
    <Stack spacing={4} p={4}>
      <h1>Verifier Registry</h1>
      <InfoPiece label="Address" data={window.verifierRegistryAddress} />
      {isLoading && <CircularProgress />}
      <Stack>
        {isLoading && "Loading..."}
        {data?.map((v, index) => {
          return <VerifierRegsitryForm verifier={v} altColor={index % 2 !== 1} />;
        })}
      </Stack>
    </Stack>
  );
}
