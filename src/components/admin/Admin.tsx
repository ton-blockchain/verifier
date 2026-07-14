import { Stack } from "@mui/material";
import { TestnetBar, useIsTestnet } from "../TestnetBar";
import SourcesRegistry from "./SourcesRegistry";
import { VerifierRegistry } from "./VerifierRegistry";
import { Footer } from "../Footer";
import { StyledTonConnectButton } from "../../styles";

export function Admin() {
  const isTestnet = useIsTestnet();
  return (
    <div>
      {isTestnet && <TestnetBar />}
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
