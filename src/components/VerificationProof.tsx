import { hasAnyOnchainProof, useLoadContractProof } from "../lib/useLoadContractProof";
import { useLoadVerifierRegistryInfo } from "../lib/useLoadVerifierRegistryInfo";
import { Box, Skeleton, Tab, Tabs } from "@mui/material";
import { PopupTableTitle, PopupWrapper } from "./VerificationProofPopup.styled";
import { styled } from "@mui/system";
import React, { useState } from "react";
import { InBrowserVerificationGuide, ManualVerificationGuide } from "./VerificationGuides";

export function VerificationProof() {
  const { data: contractProofData, isLoading } = useLoadContractProof();
  const { isLoading: isLoadingVerifierRegistry } = useLoadVerifierRegistryInfo();
  const hasProof = hasAnyOnchainProof(contractProofData);

  return (
    <Box sx={{ width: "100%" }}>
      {hasProof && !isLoadingVerifierRegistry && (
        <PopupWrapper pt={3} pb={1}>
          <PopupTableTitle>Verify manually</PopupTableTitle>
          <VerificationPanel />
        </PopupWrapper>
      )}
      {(isLoading || isLoadingVerifierRegistry) && (
        <Skeleton
          width="100%"
          height={250}
          sx={{ transform: "none", borderRadius: "20px", background: "#e6e8eb" }}
        />
      )}
    </Box>
  );
}

const VerificationPanelTabs = styled(Tabs)({
  borderBottom: "none",
  "& .MuiTabs-indicator": {
    borderBottom: "4px solid #0088CC",
    borderRadius: 20,
  },
  "& .MuiTab-root.Mui-selected": {
    color: "#000",
    fontWeight: 800,
  },
});

function VerificationPanel() {
  // const [value, setValue] = useState(0);

  // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setValue(newValue);
  // };

  return (
    <Box sx={{ width: "100%" }}>
      {/* <Box sx={{ width: "100%", borderBottom: "1px solid #E8E8E8" }}>
        <VerificationPanelTabs value={value} onChange={handleChange}>
          <Tab label="In-browser" value={0} sx={{ textTransform: "none" }} />
          <Tab label="Docker (coming soon)" disabled value={1} sx={{ textTransform: "none" }} />
        </VerificationPanelTabs>
      </Box>
      {value === 0 && <InBrowserVerificationGuide />}
      {value === 1 && <ManualVerificationGuide />} */}
      <InBrowserVerificationGuide />
    </Box>
  );
}
