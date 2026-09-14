import { Box, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FlexBoxRow } from "./Getters.styled";

export function useSwitchNetwork() {
  const navigate = useNavigate();
  const [urlParams, setUrlParams] = useSearchParams();

  return () => {
    urlParams.has("testnet") ? urlParams.delete("testnet") : urlParams.append("testnet", "");
    setUrlParams(urlParams);
    navigate(0);
  };
}

export function useIsTestnet() {
  const [params] = useSearchParams();
  return params.has("testnet");
}

export function TestnetBar() {
  const switchNetwork = useSwitchNetwork();
  return (
    <Box sx={{ background: "red", color: "white", py: 2 }}>
      <FlexBoxRow sx={{ gap: 4, px: 4 }}>
        <Typography sx={{ fontWeight: "bold", flexGrow: 1 }}>Testnet</Typography>
        <Typography
          onClick={() => {
            switchNetwork();
          }}
          sx={{ cursor: "pointer" }}>
          Switch to mainnet
        </Typography>
      </FlexBoxRow>
    </Box>
  );
}
