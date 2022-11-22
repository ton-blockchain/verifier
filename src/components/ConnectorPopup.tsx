import { Box } from "@mui/material";
import React from "react";
import { styled } from "@mui/system";
import { AppPopup } from "./AppPopup";
import chromeExtension from "../assets/chrome.svg";
import qrExtension from "../assets/tonhub.png";
import tonKeeper from "../assets/tonkeeper.png";
import { QrConnector } from "./QrConnector";
import { AdaptersList } from "./AdaptersList";
import { Adapter } from "./WalletConnect";

export enum Provider {
  CHROME = "CHROME",
  TONHUB = "TONHUB",
  TONKEEPER = "TONKEEPER",
}

const StyledContainer = styled(Box)({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "white",
  width: "fit-content",
});

const options: Adapter[] = [
  {
    provider: Provider.CHROME,
    icon: chromeExtension,
    title: "Google Chrome Plugin",
    description: "TON Wallet Plugin for Google Chrome",
    disabled: true,
  },
  {
    provider: Provider.TONKEEPER,
    icon: tonKeeper,
    title: "Tonkeeper",
    description: "A Non-custodial cryptocurrency wallet",
    disabled: true,
  },
  {
    provider: Provider.TONHUB,
    icon: qrExtension,
    title: "Tonhub",
    description: "A mobile wallet in your pocket",
  },
];

interface ConnectorPopupProps {
  showConnect: boolean;
  showQr: boolean;
  qrLink: string | null;
  onCancel: () => void;
  onClose: () => void;
  onSelect: (provider: string) => void;
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
