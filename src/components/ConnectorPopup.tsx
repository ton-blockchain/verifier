import { Box } from "@mui/material";
import React from "react";
import { styled } from "@mui/system";
import { AppPopup } from "./AppPopup";
import chromeExtension from "../assets/chrome.svg";
import qrExtension from "../assets/tonhub.png";
import { QrConnector } from "./QrConnector";
import { AdaptersList } from "./AdaptersList";

const StyledContainer = styled(Box)({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "white",
  width: "fit-content",
});

export interface Adapter {
  icon: string;
  title: string;
  description: string;
  disabled?: boolean;
}

const options: Adapter[] = [
  {
    icon: chromeExtension,
    title: "Google Chrome Plugin",
    description: "TON Wallet Plugin for Google Chrome",
    disabled: true,
  },
  { icon: qrExtension, title: "Tonhub", description: "A mobile wallet in your pocket" },
];

interface ConnectorPopupProps {
  showConnect: boolean;
  showQr: boolean;
  qrLink: string | null;
  onCancel: () => void;
  onClose: () => void;
  onSelect: () => void;
}

export function ConnectorPopup({
  showQr,
  showConnect,
  onCancel,
  qrLink,
  onSelect,
  onClose,
}: ConnectorPopupProps) {
  return (
    <>
      <AppPopup open={showConnect} onClose={onClose} maxWidth={360} hideCloseButton paddingTop>
        <StyledContainer>
          {!showQr && <AdaptersList adapters={options} onClose={onClose} select={onSelect} />}
          <QrConnector open={showQr} link={qrLink} onClose={onCancel} />
        </StyledContainer>
      </AppPopup>
    </>
  );
}
