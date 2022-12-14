import "./ContractSourceCode.css";
import { Box, Tabs, Tab, IconButton, useMediaQuery } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { VerifiedSourceCode } from "./VerifiedSourceCode";
import { DisassembledSourceCode } from "./DisassembledSourceCode";
import { useLoadContractProof } from "../lib/useLoadContractProof";
import { CenteringBox, IconBox, TitleBox, TitleText } from "./Common.styled";
import verified from "../assets/verified-light.svg";
import { styled } from "@mui/system";
import download from "../assets/download.svg";
import { AppButton } from "./AppButton";
import copy from "../assets/copy.svg";
import { downloadSources } from "../lib/downloadSources";
import useNotification from "../lib/useNotification";

enum CODE {
  DISASSEMBLED,
  SOURCE,
}

const TitleWrapper = styled(CenteringBox)({
  justifyContent: "space-between",
  width: "100%",
});

const ContentBox = styled(Box)({
  position: "relative",
});

const CopyBox = styled(Box)({
  position: "absolute",
  top: "80px",
  right: "40px",
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
  const [value, setValue] = useState<number | undefined>(undefined);
  const isExtraSmallScreen = useMediaQuery("(max-width: 450px)");
  const modifiedCodeBlock = useMediaQuery("(max-width: 600px)");
  const { showNotification } = useNotification();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onCopy = useCallback(async (type: CODE) => {
    const element = document.querySelector(
      type === CODE.SOURCE
        ? `#myVerifierContent > pre > code > .contract-verifier-code-content`
        : `pre > code > div.hljs.language-fift`,
    ) as HTMLElement;
    navigator.clipboard.writeText(element?.innerText);

    showNotification("Copied to clipboard!", "success");
  }, []);

  useEffect(() => {
    setValue(!!contractProof?.hasOnchainProof ? 0 : 1);
  }, [contractProof?.hasOnchainProof]);

  return (
    <Box
      sx={{
        border: "0.5px solid rgba(114, 138, 150, 0.24)",
        boxShadow: "rgb(114 138 150 / 8%) 0px 2px 16px",
        borderRadius: "20px",
        position: "relative",
      }}>
      <TitleBox mb={1}>
        <TitleWrapper>
          <CenteringBox mb={isExtraSmallScreen ? 2 : 0} sx={{ width: "100%" }}>
            <IconBox>
              <img src={verified} alt="Block icon" width={41} height={41} />
            </IconBox>
            <TitleText>
              {!!contractProof?.hasOnchainProof && "Verified"} Source {isExtraSmallScreen && <br />}{" "}
              Code
            </TitleText>
          </CenteringBox>
          {value === 0 && (
            <Box
              sx={{
                alignSelf: "baseline",
                position: "relative",
                top: !modifiedCodeBlock ? "3px" : "5px",
              }}>
              <AppButton
                fontSize={12}
                fontWeight={500}
                hoverBackground="#F5F5F5"
                background="#F2F2F2"
                height={modifiedCodeBlock ? 30 : 37}
                width={modifiedCodeBlock ? 30 : 167}
                onClick={() => {
                  contractProof?.files?.length && downloadSources(contractProof.files);
                }}>
                <img src={download} alt="Download icon" width={19} height={19} />
                {modifiedCodeBlock ? "" : "Download sources"}
              </AppButton>
            </Box>
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
        {value === 0 && (
          <VerifiedSourceCode button={<CopyButton onCopy={onCopy} copyText={CODE.SOURCE} />} />
        )}
        {value === 1 && (
          <DisassembledSourceCode
            button={<CopyButton onCopy={onCopy} copyText={CODE.DISASSEMBLED} />}
          />
        )}
      </ContentBox>
    </Box>
  );
}

const CopyButton = ({
  copyText,
  onCopy,
}: {
  copyText: CODE;
  onCopy: (type: CODE) => Promise<void>;
}) => {
  return (
    <CopyBox>
      <IconButton onClick={() => onCopy(copyText)}>
        <img alt="Copy Icon" src={copy} width={16} height={16} />
      </IconButton>
    </CopyBox>
  );
};

export default ContractSourceCode;
