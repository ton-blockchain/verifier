import { Box } from "@mui/material";
import { TestnetBar } from "../TestnetBar";
import { WalletConnect } from "../WalletConnect";
import SourcesRegistry from "./SourcesRegistry";
import { VerifierRegistry } from "./VerifierRegistry";
import { FlexBoxRow } from "../Getters.styled";
import { Footer } from "../Footer";
import { useEffect } from "react";
import { useWalletConnect } from "../../lib/useWalletConnect";

export function Admin() {
  const { restoreConnection } = useWalletConnect();

  useEffect(() => {
    restoreConnection();
  }, []);

  return (
    <div>
      {window.isTestnet && <TestnetBar />}
      <FlexBoxRow
        sx={{
          gap: 30,
          px: 4,
        }}>
        <h1>Admin</h1>
        <WalletConnect />
      </FlexBoxRow>
      <SourcesRegistry />
      <VerifierRegistry />
      <Footer />
    </div>
  );
}
