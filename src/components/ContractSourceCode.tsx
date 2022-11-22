import "./ContractSourceCode.css";
import { Box, Tabs, Tab } from "@mui/material";
import React, { useState } from "react";
import { VerifiedSourceCode } from "./VerifiedSourceCode";
import { DisassembledSourceCode } from "./DisassembledSourceCode";
import { useLoadContractProof } from "../lib/useLoadContractProof";
import { IconBox, TitleBox, TitleText } from "./common.styled";
import verified from "../assets/verified-light.svg";
import { styled } from "@mui/system";

const SourceCodeTabs = styled(Tabs)({
  position: "relative",

  "& .MuiTabs-indicator": {
    borderBottom: "4px solid #0088CC",
  },
  "& .MuiTab-root.Mui-selected": {
    color: "#000",
    fontWeight: 800,
  },
});

function ContractSourceCode() {
  const { data: contractProof } = useLoadContractProof();
  const [value, setValue] = useState(!!contractProof?.hasOnchainProof ? 0 : 1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <TitleBox mb={1}>
        <IconBox>
          <img src={verified} alt="Block icon" width={41} height={41} />
        </IconBox>
        <TitleText>Verified Source Code</TitleText>
      </TitleBox>
      <Box p={3}>
        <SourceCodeTabs value={value} onChange={handleChange}>
          <Tab disabled={!contractProof?.hasOnchainProof} label="FunC" />
          <Tab label="Disassembled" />
        </SourceCodeTabs>
        {value === 0 && <VerifiedSourceCode />}
        {value === 1 && <DisassembledSourceCode />}
      </Box>
    </>
  );
}

export default ContractSourceCode;
