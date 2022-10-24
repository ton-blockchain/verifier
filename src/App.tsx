import "./App.css";
import AddressInput from "./components/AddressInput";
import ContractInfo from "./components/ContractInfo";
import Spacer from "./components/Spacer";
import TopBar from "./components/TopBar";

function App() {
  return (
    <div>
      <div className="BackgroundOverlay"></div>
      <div className="App">
        <TopBar />
        <h2 style={{ textAlign: "center" }}>Smart Contract Verifier</h2>
        <AddressInput />
        <Spacer space={40} />
        <ContractInfo />
      </div>
    </div>
  );
}

export default App;
