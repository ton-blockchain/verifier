import "./App.css";
import AddressInput from "./components/AddressInput";
import ContractInfo from "./components/ContractInfo";
import Spacer from "./components/Spacer";
import TopBar from "./components/TopBar";
import ContractProofInfo from "./components/ContractProofInfo";
import { useLoadContractProof } from "./lib/useLoadContractProof";
import ContractSourceCode from "./components/ContractSourceCode";
import AddSources from "./components/AddSources";
import SubmitContractSteps from "./components/SubmitContractSteps";

function App() {
  const { isLoading, data: proofData } = useLoadContractProof();

  return (
    <div>
      <div className="BackgroundOverlay"></div>
      <div className="App">
        <a href="/EQDerEPTIh0O8lBdjWc6aLaJs5HYqlfBN2Ruj1lJQH_6vcaZ">Verified</a>
        <a href="/EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz">
          Verified2
        </a>
        <a href="/EQBuOkznvkh_STO7F8W6FcoeYhP09jjO1OeXR2RZFkN6w7NR">
          Unverified
        </a>
        <TopBar />
        <h2 style={{ textAlign: "center", color: "white" }}>
          Smart Contract Verifier
        </h2>
        <AddressInput />
        <Spacer space={40} />
        {isLoading && <div style={{ color: "white" }}>Loading...</div>}
        {!isLoading && (
          <div style={{ display: "flex", gap: 20 }}>
            <ContractInfo />
            {proofData && proofData.hasOnchainProof && <ContractProofInfo />}
          </div>
        )}
        {proofData && !proofData.hasOnchainProof && (
          <>
            <Spacer space={40} />
            <SubmitContractSteps />
          </>
        )}
        <Spacer space={40} />
        {proofData && <ContractSourceCode />}
      </div>
    </div>
  );
}

export default App;
