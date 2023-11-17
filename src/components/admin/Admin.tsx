import { Box } from "@mui/material";
import { TestnetBar } from "../TestnetBar";
import SourcesRegistry from "./SourcesRegistry";
import { VerifierRegistry } from "./VerifierRegistry";
import { FlexBoxRow } from "../Getters.styled";
import { Footer } from "../Footer";
import ConnectButton from "../ConnectButton";

export function Admin() {
  return (
    <div>
      {window.isTestnet && <TestnetBar />}
      <FlexBoxRow
        sx={{
          gap: 30,
          px: 4,
        }}>
        <h1>Admin</h1>
        <ConnectButton />
      </FlexBoxRow>
      <SourcesRegistry />
      <VerifierRegistry />
      <Footer />
    </div>
  );
}
