import { ClickAwayListener, Typography } from "@mui/material";
import { useWalletConnect } from "../lib/useWalletConnect";
import { ArrowDropUp } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { AppButton } from "./AppButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { ConnectorPopup, Provider } from "./ConnectorPopup";
import { DisconnectButton, WalletButtonContent, WalletWrapper } from "./WalletConnect.styled";
import { makeElipsisAddress } from "../utils/textUtils";
import { AnalyticsAction, sendAnalyticsEvent } from "../lib/googleAnalytics";
import { isMobile } from "react-device-detect";

export interface Adapter {
  provider: Provider;
  icon: string;
  title: string;
  description: string;
  disabled?: boolean;
}

export function WalletConnect() {
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [qrLink, setQRLink] = useState<null | string>(null);
  const { connect, walletAddress, disconnect } = useWalletConnect();

  const onDisconnect = async () => {
    setShowDisconnect(false);
    await disconnect();
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
    sendAnalyticsEvent(AnalyticsAction.CONNECT_WALLET_POPUP);
  };

  const onSelect = (provider: Provider) => {
    sendAnalyticsEvent(AnalyticsAction.SELECT_WALLET, provider);
    connect(provider, (link: string) => {
      if (isMobile) {
        // @ts-ignore
        window.location = link;
      } else {
        setQRLink(link);
      }
    });
  };

  useEffect(() => {
    if (showConnect && walletAddress) {
      sendAnalyticsEvent(AnalyticsAction.WALLET_CONNECTED);
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
          width={150}
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
          background="rgb(0, 136, 204)"
          hoverBackground="rgb(0, 95, 142)"
          fontWeight={800}
          width={150}
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
