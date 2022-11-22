import WalletConnect from "../WalletConnect";
import SourcesRegistry from "./SourcesRegistry";
import { VerifierRegistry } from "./VerifierRegistry";

export function Admin() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 30,
          alignItems: "center",
        }}>
        <h1>Admin</h1>
        <WalletConnect />
      </div>
      <SourcesRegistry />
      <VerifierRegistry />
    </div>
  );
}
