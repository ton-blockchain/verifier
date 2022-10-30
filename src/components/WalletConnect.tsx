import { Modal } from "@mui/material";
import { useState } from "react";
import QRCode from "react-qr-code";
import { useWalletConnect } from "../lib/useWalletConnect";
import Button from "./Button";

function WalletConnect() {
  const { connect, walletAddress } = useWalletConnect();
  const [qrLink, setQRLink] = useState<null | string>(null);

  return (
    <>
      <Button
        text={walletAddress ? "Connected" : "Connect"}
        onClick={() => {
          connect((link: string) => {
            setQRLink(link);
          });
        }}
      />
      <Modal
        open={!!qrLink}
        onClose={() => {
          setQRLink(null);
        }}
      >
        <QRCode value={qrLink!} />
      </Modal>
    </>
  );
}

export default WalletConnect;
