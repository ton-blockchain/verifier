import { ClickAwayListener, Typography } from "@mui/material";
import { useWalletConnect } from "../lib/useWalletConnect";
import { ArrowDropUp } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { AppButton } from "./AppButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { ConnectorPopup, Provider } from "./ConnectorPopup";
import { DisconnectButton, WalletButtonContent, WalletWrapper } from "./walletconnect.styled";
import { makeElipsisAddress } from "../utils/textUtils";

export interface Adapter {
  provider: string;
  icon: string;
  title: string;
  description: string;
  disabled?: boolean;
}

export function WalletConnect() {
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const { connect, walletAddress, disconnect } = useWalletConnect();
  const [qrLink, setQRLink] = useState<null | string>(null);

  const onDisconnect = () => {
    setShowDisconnect(false);
    disconnect();
  };

  const onClickAway = () => {
    if (showDisconnect) {
      setShowDisconnect(false);
    }
  };

  const onCancel = () => {
    setQRLink(null);
  };

  const close = async () => {
    setShowConnect(false);
    setQRLink(null);
  };

  const onOpen = () => {
    setShowConnect(true);
  };

  const onSelect = (provider: string) => {
    if (provider === Provider.TONHUB) {
      connect((link: string) => {
        setQRLink(link);
      });
    }
  };

  useEffect(() => {
    if (walletAddress) {
      close();
    }
  }, [walletAddress]);

  return (
    <WalletWrapper>
      {walletAddress ? (
        <AppButton
          fontSize={14}
          textColor="#50A7EA"
          fontWeight={800}
          width={144}
          height={44}
          transparent
          onClick={() => setShowDisconnect(true)}>
          <WalletButtonContent>
            {makeElipsisAddress(walletAddress, 4)}
            {showDisconnect ? <ArrowDropUp /> : <ArrowDropDownIcon />}
          </WalletButtonContent>
        </AppButton>
      ) : (
        <AppButton
          fontSize={14}
          textColor="#fff"
          background="#1976d2"
          hoverBackground="#156cc2"
          fontWeight={800}
          width={144}
          height={44}
          onClick={onOpen}>
          <WalletButtonContent>Connect Wallet</WalletButtonContent>
        </AppButton>
      )}
      {showDisconnect && (
        <ClickAwayListener onClickAway={onClickAway}>
          <DisconnectButton onClick={onDisconnect}>
            <PowerSettingsNewIcon style={{ width: 15, height: 15 }} />
            <Typography>Disconnect</Typography>
          </DisconnectButton>
        </ClickAwayListener>
      )}
      <ConnectorPopup
        onCancel={onCancel}
        qrLink={qrLink}
        showConnect={showConnect}
        showQr={!!qrLink}
        onClose={close}
        onSelect={onSelect}
      />
    </WalletWrapper>
  );
}
