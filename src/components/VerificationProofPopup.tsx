import { AppPopup } from "./AppPopup";
import { CenteringBox, TitleText } from "./Common.styled";
import { Box, ClickAwayListener, IconButton, useMediaQuery, useTheme } from "@mui/material";
import close from "../assets/close.svg";
import verificationPopup from "../assets/verification-popup.svg";
import React from "react";
import { CloseButtonWrapper } from "./VerificationProofPopup.styled";
import { VerificationProofTable } from "./VerificationProofTable";
import { VerificationProof } from "./VerificationProof";

interface VerificationProofPopupProps {
  onClose: () => void;
}

export function VerificationProofPopup({ onClose }: VerificationProofPopupProps) {
  const theme = useTheme();
  const headerSpacings = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <AppPopup open={true} maxWidth={headerSpacings ? "88%" : 1000} hideCloseButton>
      <ClickAwayListener onClickAway={onClose}>
        <Box sx={{ width: "100%" }}>
          <CloseButtonWrapper pt={2}>
            <IconButton sx={{ padding: 0 }} onClick={onClose}>
              <img src={close} alt="Close icon" width={15} height={15} />
            </IconButton>
          </CloseButtonWrapper>
          <CenteringBox mb={4} justifyContent="center">
            <img src={verificationPopup} alt="Popup icon" width={41} height={41} />
            <TitleText pl={2} sx={{ fontSize: 18, fontWeight: 800 }}>
              Verification Proof
            </TitleText>
          </CenteringBox>
          <VerificationProofTable />
          {import.meta.env.VITE_SHOW_MANUAL_VERIFICATION && (
            <CenteringBox mt={3}>
              <VerificationProof />
            </CenteringBox>
          )}
        </Box>
      </ClickAwayListener>
    </AppPopup>
  );
}
