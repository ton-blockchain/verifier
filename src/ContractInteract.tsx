import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { beginCell, Builder, Cell, Address } from "ton";
import Spacer from "./components/Spacer";
import WalletConnect from "./components/WalletConnect";

function CellBuilder() {
  const [state, setState] = useState<{ builder: Builder; spec: any[] }>({
    spec: [],
    builder: beginCell(),
  });

  return (
    <div>
      <h4>Build the cell</h4>
      <TextField
        required
        id="outlined-required"
        label="UINT"
        fullWidth
        onKeyUp={(e) => {
          if (e.code === "Enter") {
            // @ts-ignore
            const [num, size] = e.target.value.split(",");
            setState((state) => {
              return {
                spec: [...state.spec, { type: "uint" + size, value: num }],
                builder: state.builder.storeUint(num, size),
              };
            });
            // @ts-ignore
            e.target.value = "";
          }
        }}
      />
      <TextField
        required
        id="outlined-required"
        label="Address"
        fullWidth
        onKeyUp={(e) => {
          if (e.code === "Enter") {
            // @ts-ignore
            const addressStr = e.target.value;
            setState((state) => {
              return {
                spec: [...state.spec, { type: "address", value: addressStr }],
                builder: state.builder.storeAddress(
                  // @ts-ignore
                  Address.parse(addressStr)
                ),
              };
            });
            // @ts-ignore
            e.target.value = "";
          }
        }}
      />
      <div>{JSON.stringify(state.spec)}</div>
      <Spacer space={30} />
      <Button variant="outlined">Send the message</Button>
    </div>
  );
}

function ContractInteract() {
  return (
    <div style={{ margin: "0 auto", maxWidth: 1100, padding: 40 }}>
      <WalletConnect />
      <Spacer space={35} />
      <TextField
        required
        id="outlined-required"
        label="Contract address"
        fullWidth
      />
      <TextField
        required
        id="outlined-required"
        label="Value"
        fullWidth
        type={"number"}
      />

      <div>
        <h3>OPs</h3>
        <TextField
          required
          id="outlined-required"
          label="Value"
          fullWidth
          type={"number"}
        />
        <CellBuilder />
      </div>
    </div>
  );
}

export default ContractInteract;
