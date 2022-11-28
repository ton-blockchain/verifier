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
import { downloadSources } from "./downloadSources";

const TitleWrapper = styled(CenteringBox)({
  justifyContent: "space-between",
  width: "100%",
});

const ContentBox = styled(Box)({
  position: "relative",
});

const CopyBox = styled(Box)({
  position: "relative",
  top: 5,
  left: "97%",
  zIndex: 3,
});

const SourceCodeTabs = styled(Tabs)({
  borderBottom: "1px solid #E8E8E8",
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
          <Tab disabled={!contractProof?.hasOnchainProof} label="Sources" />
          <Tab label="Disassembled" />
        </SourceCodeTabs>
        {/* <CopyBox>
          <IconButton>
            <img alt="Copy Icon" src={copy} width={16} height={16} />
          </IconButton>
        </CopyBox> */}
        {value === 0 && <VerifiedSourceCode />}
        {value === 1 && <DisassembledSourceCode />}
      </ContentBox>
    </>
  );
}

export default ContractSourceCode;
