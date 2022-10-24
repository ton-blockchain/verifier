import "./AddressInput.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

function AddressInput() {
  const { contractAddress } = useParams();
  const [val, setVal] = useState(contractAddress ?? "");
  const navigate = useNavigate();
  return (
    <input
      className="AddressInput"
      type="search"
      value={val}
      onChange={(e: any) => {
        setVal(e.target.value);
      }}
      onKeyDown={(e: any) => {
        if (e.keyCode === 13) {
          navigate(`/${e.target.value}`);
        }
      }}
    />
  );
}

export default AddressInput;
