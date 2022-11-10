import "./App.css";
import "./assets/fonts/fonts.css";
import AddressInput from "./components/AddressInput";
import ContractInfo from "./components/ContractInfo";
import Spacer from "./components/Spacer";
import TopBar from "./components/TopBar";
import ContractProofInfo from "./components/ContractProofInfo";
import { useLoadContractProof } from "./lib/useLoadContractProof";
import ContractSourceCode from "./components/ContractSourceCode";
import SubmitContractSteps from "./components/SubmitContractSteps";
import { useOverride } from "./lib/useOverride";
import { useFileStore } from "./lib/useFileStore";
import { useNavigate } from "react-router-dom";
import { useResetState } from "./lib/useResetState";
import { useContractAddress } from "./lib/useContractAddress";

const examples_not_verified = [
  ["wallet-v3", "EQBuOkznvkh_STO7F8W6FcoeYhP09jjO1OeXR2RZFkN6w7NR"],
  ["dns-root", "Ef-OJd0IF0yc0xkhgaAirq12WawqnUoSuE9RYO3S7McG6lDh"],
];

const examples = [
  ["wallet-v4", "EQDerEPTIh0O8lBdjWc6aLaJs5HYqlfBN2Ruj1lJQH_6vcaZ"],
  ["dns-collection", "EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz"],
  ["dns-item", "EQAGSjhQajnMSne9c9hGnKdMKmohX2-MkZuOkk7TmwQKwFOU"],
  ["counter", "EQC-QTihJV_B4f8M2nynateMLynaRT_uwNYnnuyy87kam-G7"],
  ["jetton-minter-discoverable", "EQD-LkpmPTHhPW68cNfc7B83NcfE9JyGegXzAT8LetpQSRSm"],
  ["jetton-minter", "EQBb4JNqn4Z6U6-nf0cSLnOJo2dxj1QRuGoq-y6Hod72jPbl"],
  ["jetton-wallet", "EQAhuLHxOcrBwwMHKDnCUMYefuHwJ2iTOFKHWYQlDD-dgb__"],
  ["single-nominator", "Ef_BLbagjGnqZEkpURP96guu7M9aICAYe5hKB_P5Ng5Gju5Y"],
];

function App() {
  const { isLoading, data: proofData } = useLoadContractProof();
  const { isAddressValid, contractAddress } = useContractAddress();
  const canOverride = useOverride();
  const { hasFiles } = useFileStore();
  const navigate = useNavigate();
  useResetState();

  return (
    <div>
      <div className="BackgroundOverlay"></div>
      <div className="App">
        <div
          style={{
            display: "flex",
            gap: 10,
            background: "white",
            borderRadius: 20,
            padding: "10px 20px",
          }}>
          {examples.concat(examples_not_verified).map(([name, address]) => (
            <span
              style={{
                color: "blue",
                cursor: "pointer",
              }}
              key={name}
              onClick={() => {
                navigate(`/${address}`);
              }}>
              {name}
            </span>
          ))}
        </div>
        <TopBar />
        <h2
          style={{
            textAlign: "center",
            color: "white",
            fontFamily: "Mulish-Bold, sans-serif",
          }}>
          Smart Contract Verifier
        </h2>
        <AddressInput />
        <Spacer space={40} />
        {isLoading && isAddressValid && <div style={{ color: "white" }}>Loading...</div>}
        {!contractAddress && <div style={{ color: "white" }}>Enter an address</div>}
        {!!contractAddress && !isAddressValid && (
          <div style={{ color: "white" }}>Invalid address</div>
        )}
        {!isLoading && (
          <div style={{ display: "flex", gap: 20 }}>
            <ContractInfo />
            {proofData && proofData.hasOnchainProof && <ContractProofInfo />}
          </div>
        )}
        {proofData && (!proofData.hasOnchainProof || canOverride) && (
          <>
            <Spacer space={40} />
            <SubmitContractSteps />
          </>
        )}
        <Spacer space={40} />
        {proofData && !hasFiles() && <ContractSourceCode />}
      </div>
    </div>
  );
}

export default App;
