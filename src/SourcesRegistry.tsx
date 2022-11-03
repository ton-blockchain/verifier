import InfoPiece from "./components/InfoPiece";
import { useEffect } from "react";
import { makeGetCall } from "./lib/makeGetCall";
import { getClient } from "./lib/getClient";
import { Address, beginCell, Cell, toNano } from "ton";
import { useMutation, useQuery } from "@tanstack/react-query";
import WalletConnect from "./components/WalletConnect";
import { useWalletConnect } from "./lib/useWalletConnect";
import Button from "./components/Button";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
} from "@mui/material";

function useLoadSourcesRegistryInfo() {
  const addr = import.meta.env.VITE_SOURCES_REGISTRY;
  return useQuery(["sourcesRegistry", addr], async () => {
    const tc = await getClient();
    const admin = await makeGetCall(
      addr,
      "get_admin_address",
      [],
      (s) => (s[0] as Cell).beginParse().readAddress()!.toFriendly(),
      tc
    );
    const verifierRegistry = await makeGetCall(
      addr,
      "get_verifier_registry_address",
      [],
      (s) => (s[0] as Cell).beginParse().readAddress()!.toFriendly(),
      tc
    );

    const codeCellHash = Cell.fromBoc(
      (await tc.getContractState(Address.parse(addr))).code as Buffer
    )[0]
      .hash()
      .toString("base64");
    return { admin, verifierRegistry, codeCellHash };
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
  return beginCell()
    .storeUint(3004, 32)
    .storeUint(0, 64)
    .storeAddress(newAdmin)
    .endCell();
}

function setSourceItemCode(newCode: Cell): Cell {
  return beginCell()
    .storeUint(4005, 32)
    .storeUint(0, 64)
    .storeRef(newCode)
    .endCell();
}

function changeCode(newCode: Cell): Cell {
  return beginCell()
    .storeUint(5006, 32)
    .storeUint(0, 64)
    .storeRef(newCode)
    .endCell();
}

function ActionDialog({
  text,
  action,
}: {
  text: string;
  action: (param: string) => Cell;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const { requestTXN } = useWalletConnect();

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
              requestTXN(
                import.meta.env.VITE_SOURCES_REGISTRY,
                toNano(0.01),
                action(value)
              );
            }}
          />
        </DialogActions>
      </Dialog>
    </>
  );
}

function SourcesRegistry() {
  const addr = import.meta.env.VITE_SOURCES_REGISTRY;

  const { data, isLoading } = useLoadSourcesRegistryInfo();

  return (
    <div style={{ padding: "20px 40px" }}>
      <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
        <h1>Sources Registry</h1>
        <WalletConnect />
      </div>
      {isLoading && <div>Loading...</div>}
      {data && (
        <>
          <InfoPiece label="Address" data={addr} />
          <InfoPiece label="Admin" data={data.admin} />
          <InfoPiece label="Verifier Reg." data={data.verifierRegistry} />
          <InfoPiece label="Code hash" data={data.codeCellHash} />
          <div style={{ marginTop: 20, gap: 10, display: "flex" }}>
            <ActionDialog
              text="Change Verifier Registry"
              action={(val) => changeVerifierRegistry(Address.parse(val))}
            />
            <ActionDialog
              text="Change Admin"
              action={(val) => changeAdmin(Address.parse(val))}
            />
            <ActionDialog
              text="Set code"
              action={(val) => changeCode(Cell.fromBoc(val)[0])}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default SourcesRegistry;
