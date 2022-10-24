import "./App.css";
import AddressInput from "./components/AddressInput";
import ContractInfo from "./components/ContractInfo";
import Spacer from "./components/Spacer";
import TopBar from "./components/TopBar";
import ContractProofInfo from "./components/ContractProofInfo";
import { useLoadContractProof } from "./lib/useLoadContractProof";
import ContractSourceCode from "./components/ContractSourceCode";
import AddSources from "./components/AddSources";

function App() {
  const { isLoading, data: proofData } = useLoadContractProof();

  return (
    <div>
      <div className="BackgroundOverlay"></div>
      <div className="App">
        <a href="/EQDerEPTIh0O8lBdjWc6aLaJs5HYqlfBN2Ruj1lJQH_6vcaZ">TEMP</a>
        <a href="/EQBuOkznvkh_STO7F8W6FcoeYhP09jjO1OeXR2RZFkN6w7NR">TEMP2</a>
        <TopBar />
        <h2 style={{ textAlign: "center" }}>Smart Contract Verifier</h2>
        <AddressInput />
        <Spacer space={40} />
        {isLoading && <div>Loading...</div>}
        {!isLoading && (
          <div style={{ display: "flex", gap: 20 }}>
            <ContractInfo />
            {proofData && proofData.hasOnchainProof && <ContractProofInfo />}
          </div>
        )}
        {proofData && !proofData.hasOnchainProof && (
          <>
            <Spacer space={40} />
            <AddSources />
          </>
        )}
        <Spacer space={40} />
        {proofData && <ContractSourceCode />}
      </div>
    </div>
  );
}

export default App;
