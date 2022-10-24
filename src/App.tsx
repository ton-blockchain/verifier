import "./App.css";
import AddressInput from "./components/AddressInput";
import TopBar from "./components/TopBar";

function App() {
  return (
    <div>
      <div className="BackgroundOverlay"></div>
      <div className="App">
        <TopBar />
        <h2 style={{textAlign: 'center'}}>Smart Contract Verifier</h2>
        <AddressInput />
      </div>
    </div>
  );
}

export default App;
