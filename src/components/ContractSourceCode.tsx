import "./ContractSourceCode.css";
import Container from "./Container";
import { Box, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import { VerifiedSourceCode } from "./VerifiedSourceCode";
import { DisassembledSourceCode } from "./DisassembledSourceCode";
import { useLoadContractProof } from "../lib/useLoadContractProof";

function ContractSourceCode() {
  const { data: contractProof } = useLoadContractProof();
  const [value, setValue] = useState(!!contractProof?.hasOnchainProof ? 0 : 1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container>
      <h3>Source Code</h3>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab disabled={!contractProof?.hasOnchainProof} label="FunC" />
          <Tab label="Disassembled" />
        </Tabs>
      </Box>
      {value === 0 && <VerifiedSourceCode />}
      {value === 1 && <DisassembledSourceCode />}
    </Container>
  );
}

export default ContractSourceCode;
