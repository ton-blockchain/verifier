import InfoPiece from "../InfoPiece";
import { Address, beginCell, Cell, toNano } from "ton";
import Button from "../Button";
import { useEffect, useState } from "react";
import { Stack, Box, Snackbar, Alert, CircularProgress } from "@mui/material";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useForm } from "react-hook-form";
import { TextField } from "./form/TextField";
import { useRequestTXN } from "../../hooks";
import { useLoadSourcesRegistryInfo } from "../../lib/useLoadSourcesRegistryInfo";

// TODO: combine into a single cell
function changeVerifierRegistry(newVerifierRegistry: Address): Cell {
  return beginCell()
    .storeUint(2003, 32)
    .storeUint(0, 64)
    .storeAddress(newVerifierRegistry)
    .endCell();
}

function changeAdmin(newAdmin: Address): Cell {
  return beginCell().storeUint(3004, 32).storeUint(0, 64).storeAddress(newAdmin).endCell();
}

function setDeploymentCosts(minTon: bigint, maxTon: bigint): Cell {
  return beginCell()
    .storeUint(6007, 32)
    .storeUint(0, 64)
    .storeCoins(minTon)
    .storeCoins(maxTon)
    .endCell();
}

type AdminForm = {
  admin: string;
};

type VerifierRegistryForm = {
  verifierRegistry: string;
};

type DeploymentCostsForm = {
  minTon: string;
  maxTon: string;
};

function SourcesRegistry() {
  const { data, isLoading } = useLoadSourcesRegistryInfo();
  const [tonConnection] = useTonConnectUI();
  const requestTXN = useRequestTXN();

  const adminForm = useForm<AdminForm>({
    defaultValues: {
      admin: data?.admin || "",
    },
  });

  const verifierRegistryForm = useForm<VerifierRegistryForm>({
    defaultValues: {
      verifierRegistry: data?.verifierRegistry || "",
    },
  });

  const deploymentCostsForm = useForm<DeploymentCostsForm>({
    defaultValues: {
      minTon: data?.deploymentCosts.min || "",
      maxTon: data?.deploymentCosts.max || "",
    },
  });

  async function onAdminSubmit(values: AdminForm) {
    if (!data?.address) {
      throw new Error("no address");
    }

    if (values.admin !== data?.admin) {
      try {
        const cell = changeAdmin(Address.parse(values.admin));
        const result = await requestTXN(data.address.toString(), toNano("0.01"), cell);
        if (result === "rejected") {
          adminForm.setError("admin", { message: "Failed to change admin" });
        }
      } catch (err) {
        let errMessage = "Failed to change admin";

        if ("message" in (err as Error)) {
          errMessage = (err as Error).message;
        }

        adminForm.setError("admin", { message: errMessage });
      }
    }
  }
  async function onVerifierRegistrySubmit(values: VerifierRegistryForm) {
    if (!data?.address) {
      throw new Error("no address");
    }

    if (values.verifierRegistry !== data?.verifierRegistry) {
      try {
        const cell = changeVerifierRegistry(Address.parse(values.verifierRegistry));
        const result = await requestTXN(data.address.toString(), toNano("0.01"), cell);
        if (result === "rejected") {
          verifierRegistryForm.setError("verifierRegistry", {
            message: "Failed to change verifier registry",
          });
        }
      } catch (err) {
        let errMessage = "Failed to change verifier registry";

        if ("message" in (err as Error)) {
          errMessage = (err as Error).message;
        }

        verifierRegistryForm.setError("verifierRegistry", { message: errMessage });
      }
    }
  }

  async function onDeploymentCostsSubmit(values: DeploymentCostsForm) {
    if (!data?.address) {
      throw new Error("no address");
    }

    if (
      values.minTon !== data?.deploymentCosts.min ||
      values.maxTon !== data?.deploymentCosts.max
    ) {
      try {
        const cell = setDeploymentCosts(toNano(values.minTon), toNano(values.maxTon));
        const result = await requestTXN(data.address.toString(), toNano("0.01"), cell);
        if (result === "rejected") {
          deploymentCostsForm.setError("root", { message: "Failed to change deployment costs" });
        }
      } catch (err) {
        let errMessage = "Failed to change deployment costs";

        if ("message" in (err as Error)) {
          errMessage = (err as Error).message;
        }

        deploymentCostsForm.setError("root", { message: errMessage });
      }
    }
  }

  useEffect(() => {
    if (data) {
      adminForm.reset({
        admin: data.admin,
      });
      verifierRegistryForm.reset({
        verifierRegistry: data.verifierRegistry,
      });
      deploymentCostsForm.reset({
        minTon: data.deploymentCosts.min,
        maxTon: data.deploymentCosts.max,
      });
    }
  }, [data]);

  return (
    <Stack spacing={4} p={4}>
      <h1>Sources Registry</h1>
      {isLoading && <CircularProgress />}
      {data && (
        <>
          <InfoPiece label="Address" data={data.address.toString()} />

          <form id="adminForm" onSubmit={adminForm.handleSubmit(onAdminSubmit)}>
            <Stack spacing={2}>
              {!adminForm.formState.isValid && (
                <Alert severity="error">
                  {Object.entries(adminForm.formState.errors).map(([key, value]) => {
                    return <div key={key}>{value.message}</div>;
                  })}
                </Alert>
              )}
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  {...adminForm.register("admin")}
                  control={adminForm.control}
                  label="Admin"
                />
                <Button text="Save" type="submit" disabled={!adminForm.formState.isDirty} />
              </Stack>
            </Stack>
          </form>

          <form
            id="verifierRegistryForm"
            onSubmit={verifierRegistryForm.handleSubmit(onVerifierRegistrySubmit)}>
            <Stack spacing={2}>
              {!verifierRegistryForm.formState.isValid && (
                <Alert severity="error">
                  {Object.entries(verifierRegistryForm.formState.errors).map(([key, value]) => {
                    return <div key={key}>{value.message}</div>;
                  })}
                </Alert>
              )}
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  {...verifierRegistryForm.register("verifierRegistry")}
                  control={verifierRegistryForm.control}
                  label="Verifier Reg."
                />
                <Button
                  text="Save"
                  type="submit"
                  disabled={!verifierRegistryForm.formState.isDirty}
                />
              </Stack>
            </Stack>
          </form>

          <form
            id="sourcesRegistryForm"
            onSubmit={deploymentCostsForm.handleSubmit(onDeploymentCostsSubmit)}>
            <Stack spacing={2}>
              {!deploymentCostsForm.formState.isValid && (
                <Alert severity="error">
                  {Object.entries(deploymentCostsForm.formState.errors).map(([key, value]) => {
                    return <div key={key}>{value.message}</div>;
                  })}
                </Alert>
              )}

              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  {...deploymentCostsForm.register("minTon")}
                  control={deploymentCostsForm.control}
                  label="Min Ton"
                />
                <TextField
                  {...deploymentCostsForm.register("maxTon")}
                  control={deploymentCostsForm.control}
                  label="Max Ton"
                />
                <Button
                  text="Save"
                  type="submit"
                  disabled={!deploymentCostsForm.formState.isDirty}
                />
              </Stack>
            </Stack>
          </form>
        </>
      )}
    </Stack>
  );
}

export default SourcesRegistry;
