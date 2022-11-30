import "./ContractSourceCode.css";
import { Box, Tabs, Tab, IconButton } from "@mui/material";
import React, { useState } from "react";
import { VerifiedSourceCode } from "./VerifiedSourceCode";
import { DisassembledSourceCode } from "./DisassembledSourceCode";
import { useLoadContractProof } from "../lib/useLoadContractProof";
import { CenteringBox, IconBox, TitleBox, TitleText } from "./common.styled";
import verified from "../assets/verified-light.svg";
import { styled } from "@mui/system";
import download from "../assets/download.svg";
import { AppButton } from "./AppButton";
import copy from "../assets/copy.svg";
import { downloadSources } from "../lib/downloadSources";

const TitleWrapper = styled(CenteringBox)({
  justifyContent: "space-between",
  width: "100%",
});

const ContentBox = styled(Box)({
  position: "relative",
});

const CopyBox = styled(Box)({
  position: "absolute",
  top: "9%",
  right: "3%",
  zIndex: 3,
});

const SourceCodeTabs = styled(Tabs)({
  borderBottom: "1px solid #E8E8E8",
  "& .MuiTabs-indicator": {
    borderBottom: "4px solid #0088CC",
    borderRadius: 20,
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
    <Box
      sx={{
        border: "0.5px solid rgba(114, 138, 150, 0.24)",
        boxShadow: "rgb(114 138 150 / 8%) 0px 2px 16px",
        borderRadius: "20px",
      }}>
      <TitleBox mb={1}>
        <TitleWrapper>
          <CenteringBox sx={{ width: "100%" }}>
            <IconBox>
              <img src={verified} alt="Block icon" width={41} height={41} />
            </IconBox>
            <TitleText>Verified Source Code</TitleText>
          </CenteringBox>
          {value === 0 && (
            <div>
              <AppButton
                fontSize={12}
                fontWeight={500}
                hoverBackground="#F5F5F5"
                background="#F2F2F2"
                height={37}
                width={167}
                onClick={() => {
                  contractProof?.files?.length && downloadSources(contractProof.files);
                }}>
                <img src={download} alt="Download icon" width={19} height={19} />
                Download sources
              </AppButton>
            </div>
          )}
        </TitleWrapper>
      </TitleBox>
      <ContentBox p={3}>
        <SourceCodeTabs value={value} onChange={handleChange}>
          <Tab
            sx={{ textTransform: "none" }}
            disabled={!contractProof?.hasOnchainProof}
            label="Sources"
          />
          <Tab sx={{ textTransform: "none" }} label="Disassembled" />
        </SourceCodeTabs>
        {value === 0 && <VerifiedSourceCode />}
        {value === 1 && <DisassembledSourceCode />}
        {/*<CopyBox>*/}
        {/*  <IconButton disabled>*/}
        {/*    <img alt="Copy Icon" src={copy} width={16} height={16} />*/}
        {/*  </IconButton>*/}
        {/*</CopyBox>*/}
      </ContentBox>
    </Box>
  );
}

export default ContractSourceCode;
