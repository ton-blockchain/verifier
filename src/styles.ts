import { styled } from "@mui/material";
import { TonConnectButton } from "@tonconnect/ui-react";

export const StyledTonConnectButton = styled(TonConnectButton)(({ theme }) => ({
  button: {
    background: theme.palette.primary.main,
    "*": { color: "white" },
    svg: {
      "*": {
        stroke: "white",
      },
    },
  },
}));
