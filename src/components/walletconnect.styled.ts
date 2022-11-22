import { styled } from "@mui/system";
import { Box } from "@mui/material";

const WalletWrapper = styled(Box)({
  position: "relative",
  display: "flex",
  alignItems: "center",

  "& p": {
    paddingRight: 10,
    fontSize: 12,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

const WalletButtonContent = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: 14,
  fontWeight: 700,
});

const DisconnectButton = styled("button")({
  zIndex: 4,
  display: "flex",
  alignItems: "center",
  position: "absolute",
  right: 0,
  filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))",
  background: "white",
  border: "none",
  height: 35,
  width: "100%",
  borderRadius: 20,
  gap: 10,
  justifyContent: "center",
  top: "calc(100% + 10px)",
  cursor: "pointer",
  "& p": {
    fontSize: 12,
  },
});

export { WalletWrapper, WalletButtonContent, DisconnectButton };
