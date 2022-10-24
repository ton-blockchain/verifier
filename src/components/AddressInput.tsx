import "./AddressInput.css";
import { useNavigate } from "react-router-dom";

function AddressInput() {
  const navigate = useNavigate();
  return (
    <input
      className="AddressInput"
      type="search"
      onKeyDown={(e: any) => {
        if (e.keyCode === 13) {
          navigate(`/${e.target.value}`);
        }
      }}
    />
  );
}

export default AddressInput;
