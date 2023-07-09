import InfoPiece from "../../components/InfoPiece";
import { getClient } from "../../lib/getClient";
import { Address, beginCell, Cell, fromNano, toNano } from "ton";
import { useQuery } from "@tanstack/react-query";
import Button from "../../components/Button";
import React from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import { getAdmin } from "../../lib/getAdmin";
import { useRequestTXN } from "../../hooks";
import { SourcesRegistry as SourcesRegistryContract } from "../../lib/wrappers/sources-registry";

function useLoadSourcesRegistryInfo() {
  const address = Address.parse(window.sourcesRegistryAddress);
  return useQuery(["sourcesRegistry", address], async () => {
    const tc = await getClient();
    const admin = await getAdmin(address, tc);
    const contract = tc.open(SourcesRegistryContract.createFromAddress(address));

    const verifierRegistry = (await contract.getVerifierRegistryAddress()).toString();
    const deploymentCosts = await contract.getDeploymentCosts();

    const codeCellHash = Cell.fromBoc((await tc.getContractState(address)).code as Buffer)[0]
      .hash()
      .toString("base64");
    return {
      admin,
      verifierRegistry,
      codeCellHash,
      address,
      deploymentCosts,
    };
  });
}

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

function ActionDialog({
  text,
  action,
  address,
}: {
  text: string;
  action: (param: string) => Cell;
  address: Address;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const requestTXN = useRequestTXN();

  return (
    <>
      <Button
        text={text}
        onClick={() => {
          setOpen(true);
        }}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{text}</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            autoFocus
            margin="dense"
            id="name"
            label="Address"
            fullWidth
            variant="standard"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button text={"Cancel"} onClick={handleClose} />
          <Button
            text={"DOIT"}
            onClick={() => {
              requestTXN(address.toString(), toNano("0.01"), action(value));
            }}
          />
        </DialogActions>
      </Dialog>
    </>
  );
}

function SourcesRegistry() {
  const { data, isLoading } = useLoadSourcesRegistryInfo();

  return (
    <div style={{ padding: "20px 40px" }}>
      <h1>Sources Registry</h1>
      {isLoading && <div>Loading...</div>}
      {data && (
        <>
          <InfoPiece label="Address" data={data.address.toString()} />
          <InfoPiece label="Admin" data={data.admin!} />
          <InfoPiece label="Verifier Reg." data={data.verifierRegistry} />
          <InfoPiece label="Min Ton" data={data.deploymentCosts.min} />
          <InfoPiece label="Max Ton" data={data.deploymentCosts.max} />
          <InfoPiece label="Code hash" data={data.codeCellHash} />
          <div
            style={{
              marginTop: 20,
              gap: 10,
              display: "flex",
            }}>
            <ActionDialog
              text="Change Verifier Registry"
              action={(val) => changeVerifierRegistry(Address.parse(val))}
              address={data.address}
            />
            <ActionDialog
              text="Change Admin"
              action={(val) => changeAdmin(Address.parse(val))}
              address={data.address}
            />
            <ActionDialog
              text="Set deployment costs"
              action={(val) => {
                const [min, max] = val.split(",");
                return setDeploymentCosts(toNano(min), toNano(max));
              }}
              address={data.address}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default SourcesRegistry;
