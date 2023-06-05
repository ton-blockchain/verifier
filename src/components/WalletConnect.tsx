import React from "react";
import { AppButton } from "./AppButton";
import Button from "./Button";

export const onConnect = () => {
  const container = document.getElementById("ton-connect-button");
  const btn = container?.querySelector("button");

  if (btn) {
    btn.click();
  }
};

function WalletConnect() {
  return <Button text="Connect Wallet" onClick={onConnect} />;
}

export { WalletConnect };
