import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { checkForDuplicatedValues, validateAddress } from "../utils/textUtils";

function useContractAddress() {
  const { contractAddress } = useParams();
  const { results, setResults } = useLocalStorage();
  let isAddressValid = validateAddress(contractAddress);

  useEffect(() => {
    if (contractAddress && isAddressValid && !checkForDuplicatedValues(results, contractAddress)) {
      setResults([...results, { index: results.length, value: contractAddress }]);
    }
  }, [contractAddress]);

  return {
    contractAddress,
    isAddressValid,
  };
}

export { useContractAddress };
