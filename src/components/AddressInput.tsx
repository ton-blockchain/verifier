import "./AddressInput.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContractAddress } from '../lib/useContractAddress';

function AddressInput() {
  const { contractAddress } = useContractAddress();
  const [val, setVal] = useState(contractAddress ?? "");

  useEffect(() => {
    setVal(contractAddress ?? "");
  }, [contractAddress]);

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
