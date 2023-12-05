import InfoPiece from "../InfoPiece";
import { useLoadVerifierRegistryInfo } from "../../lib/useLoadVerifierRegistryInfo";
import { Dictionary, beginCell, toNano, DictionaryValue, Slice, Address } from "ton";
import { toBigIntBE } from "bigint-buffer";
import { useMemo } from "react";
import { Stack, Grid, CircularProgress, Alert } from "@mui/material";
import Button from "../Button";
import { toSha256Buffer } from "../../lib/useLoadContractProof";
import { useRequestTXN } from "../../hooks";
import { Verifier } from "../../lib/wrappers/verifier-registry";
import { useFieldArray, useForm } from "react-hook-form";
import { TextField } from "./form/TextField";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useLoadSourcesRegistryInfo } from "../../lib/useLoadSourcesRegistryInfo";

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

function removeVerifier(params: { queryId?: number; id: bigint }) {
  let msgBody = beginCell();
  msgBody.storeUint(OperationCodes.removeVerifier, 32);
  msgBody.storeUint(params.queryId || 0, 64);
  msgBody.storeUint(params.id, 256);
  return msgBody.endCell();
}

function VerifierRegsitryForm({
  verifier,
  altColor,
  isNew,
}: {
  verifier: Verifier;
  altColor: boolean;
  isNew: boolean;
}) {
  const requestTXN = useRequestTXN();
  const { data: sourcesRegistry } = useLoadSourcesRegistryInfo();

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
    mode: "onChange",
  });

  async function onSubmit(values: VerifierRegistryForm) {
    // validate values
    if (!values.name) {
      form.setError("name", { message: "Name is required" });
      return;
    }

    if (!values.url) {
      form.setError("url", { message: "Url is required" });
      return;
    }

    if (!values.quorum || Number(values.quorum) < 1) {
      form.setError("quorum", { message: "Quorum is required and should be at least 1" });
      return;
    }

    try {
      const result = await requestTXN(
        sourcesRegistry?.verifierRegistry ?? "",
        toNano(isNew ? "1000" : "0.01"),
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
        <Stack flexDirection={"row"} alignItems={"center"} gap={2}>
          <h3 style={{ margin: 0 }}>{isNew ? "Add Verifier" : form.getValues("name")}</h3>
          {!isNew && (
            <Button
              text="Remove"
              onClick={() => {
                requestTXN(
                  sourcesRegistry!.verifierRegistry,
                  toNano("0.01"),
                  removeVerifier({ id: sha256BN(form.getValues("name")) }),
                );
              }}
            />
          )}
        </Stack>
        <InfoPiece label="Admin" data={verifier.admin.toString()} />
        {isNew && <TextField label="Name" name="name" control={form.control} />}
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
        <Button
          text={isNew ? "Add verifier" : "Update config"}
          type="submit"
          disabled={!form.formState.isDirty}
        />
      </Stack>
    </form>
  );
}

export function VerifierRegistry() {
  const { data, isLoading } = useLoadVerifierRegistryInfo();
  const { data: sourcesRegistry } = useLoadSourcesRegistryInfo();
  const [tonConnectUI] = useTonConnectUI();

  return (
    <Stack spacing={4} p={4}>
      <h1>Verifier Registry</h1>
      <InfoPiece label="Address" data={sourcesRegistry?.verifierRegistry ?? ""} />
      {isLoading && <CircularProgress />}
      <Stack>
        {isLoading && "Loading..."}
        {data?.map((v, index) => {
          return <VerifierRegsitryForm verifier={v} altColor={index % 2 !== 1} isNew={false} />;
        })}
      </Stack>
      {tonConnectUI.account?.address && (
        <VerifierRegsitryForm
          isNew={true}
          altColor={true}
          verifier={{
            admin: Address.parse(tonConnectUI.account?.address),
            name: "",
            quorum: 0,
            url: "",
            pubKeyEndpoints: {},
          }}
        />
      )}
    </Stack>
  );
}
