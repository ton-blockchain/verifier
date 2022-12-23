import React from "react";
import { Box, Fade } from "@mui/material";
import QRCode from "react-qr-code";
import { styled } from "@mui/system";
import { ConnectorHeader } from "./ConnectorHeader";

const StyledContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const StyledQrBox = styled(Box)({
  width: 260,
  height: 260,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

interface QrConnectorProps {
  open: boolean;
  onClose: () => void;
  link: string | null;
}

export function QrConnector({ open, onClose, link }: QrConnectorProps) {
  if (!open) {
    return null;
  }

  return (
    <>
      <Fade in>
        <StyledContainer>
          <ConnectorHeader title="Connect" onClose={onClose} />
          <StyledQrBox>{link && <QRCode value={link!} />}</StyledQrBox>
        </StyledContainer>
      </Fade>
    </>
  );
}
