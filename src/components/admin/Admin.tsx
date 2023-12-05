import { Box, Stack } from "@mui/material";
import { TestnetBar } from "../TestnetBar";
import SourcesRegistry from "./SourcesRegistry";
import { VerifierRegistry } from "./VerifierRegistry";
import { FlexBoxRow } from "../Getters.styled";
import { Footer } from "../Footer";
import { StyledTonConnectButton } from "../../styles";

export function Admin() {
  return (
    <div>
      {window.isTestnet && <TestnetBar />}
      <Stack direction="row" justifyContent="space-between" alignItems="center" p={4}>
        <h1>Admin</h1>
        <StyledTonConnectButton />
      </Stack>
      <SourcesRegistry />
      <VerifierRegistry />
      <Footer />
    </div>
  );
}
