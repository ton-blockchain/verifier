import { useTonConnectUI } from "@tonconnect/ui-react";
import React from "react";
import { AppButton } from "./AppButton";

function ConnectButton() {
  const [tonConnect] = useTonConnectUI();
  return (
    <AppButton
      background="#1976d2"
      hoverBackground="#156cc2"
      height={37}
      fontSize={14}
      fontWeight={700}
      textColor="#fff"
      type="button"
      onClick={() => tonConnect.connectWallet()}>
      Connect wallet
    </AppButton>
  );
}

export default ConnectButton;
