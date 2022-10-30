import { Menu, MenuItem, Modal } from "@mui/material";
import { useState } from "react";
import QRCode from "react-qr-code";
import { useWalletConnect } from "../lib/useWalletConnect";
import Button from "./Button";
import { KeyboardArrowDown } from "@mui/icons-material";
import React from "react";

function WalletConnect() {
  const { connect, walletAddress, disconnect } = useWalletConnect();
  const [qrLink, setQRLink] = useState<null | string>(null);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        text={walletAddress ? walletAddress : "Connect"}
        onClick={(e) => {
          if (walletAddress) {
            handleClick(e);
          } else {
            connect((link: string) => {
              setQRLink(link);
            });
          }
        }}
        endIcon={walletAddress && <KeyboardArrowDown />}
      />
      <Menu
        id="login-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            disconnect();
            handleClose();
          }}
          disableRipple
        >
          Disconnect
        </MenuItem>
      </Menu>
      <Modal
        open={!!qrLink && !walletAddress}
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
