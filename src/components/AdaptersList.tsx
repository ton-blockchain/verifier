import React from "react";
import { styled } from "@mui/system";
import { Box, Typography } from "@mui/material";
import { Adapter } from "./WalletConnect";
import { ConnectorHeader } from "./ConnectorHeader";

const ConnectionOption = styled(Box)({
  display: "flex",
  alignItems: "center",
  height: 70,
  transition: "all .15s",
  "&:hover": {
    cursor: "pointer",
    background: "rgba(238,238,238,0.45)",
  },
});

const DisabledOption = styled(Box)({
  display: "flex",
  alignItems: "center",
  height: 70,
  color: "rgb(229,229,229)",
});

interface AdaptersListProps {
  adapters: Adapter[];
  onClose: () => void;
  select: (provider: string) => void;
}

export function AdaptersList({ adapters, select, onClose }: AdaptersListProps) {
  return (
    <>
      <ConnectorHeader title="Select Wallet" onClose={onClose} />
      <Box>
        {adapters.map((adapter) => {
          if (adapter.disabled) {
            return (
              <DisabledOption key={adapter.description}>
                <img alt="Icon" src={adapter.icon} width={40} height={40} />
                <Box ml={2}>
                  <Typography variant="h6">{adapter.title}</Typography>
                  <Typography variant="body2">{adapter.description}</Typography>
                </Box>
              </DisabledOption>
            );
          } else {
            return (
              <ConnectionOption key={adapter.description} onClick={() => select(adapter.provider)}>
                <img alt="Icon" src={adapter.icon} width={40} height={40} />
                <Box ml={2}>
                  <Typography variant="h6">{adapter.title}</Typography>
                  <Typography variant="body2" sx={{ color: "#313855" }}>
                    {adapter.description}
                  </Typography>
                </Box>
              </ConnectionOption>
            );
          }
        })}
      </Box>
    </>
  );
}
