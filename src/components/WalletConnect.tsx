import { Box, Menu, MenuItem, Modal } from "@mui/material";
import { useState } from "react";
import QRCode from "react-qr-code";
import { useWalletConnect } from "../lib/useWalletConnect";
import Button from "./Button";
import { KeyboardArrowDown, Close } from "@mui/icons-material";
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
        sx={{ fontWeight: 800 }}
        text={walletAddress ? walletAddress : "Connect wallet"}
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
      <Menu id="login-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            disconnect();
            handleClose();
          }}
          disableRipple>
          Disconnect
        </MenuItem>
      </Menu>
      <Modal
        open={!!qrLink && !walletAddress}
        onClose={() => {
          setQRLink(null);
        }}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 4,
            color: "#000",
          }}>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setQRLink(null);
            }}>
            <Close
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
              }}
            />
          </div>
          <div style={{ textAlign: "center" }}>Connect with Tonhub</div>
          <br />
          <QRCode value={qrLink!} />
        </Box>
      </Modal>
    </>
  );
}

export default WalletConnect;
