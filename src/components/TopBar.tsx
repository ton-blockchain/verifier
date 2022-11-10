import "./TopBar.css";
import icon from "../assets/icon.svg";
import WalletConnect from "./WalletConnect";

function TopBar() {
  return (
    <div className="TopBar">
      <img src={icon} />
      <h3>TON VERIFY</h3>
      <div className="TopBar-Right">
        <WalletConnect />
        <h3>GITHUB</h3>
      </div>
    </div>
  );
}

export default TopBar;
