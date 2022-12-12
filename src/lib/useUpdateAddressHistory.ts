import { useEffect } from "react";
import { useContractAddress } from "./useContractAddress";
import { useAddressHistory } from "./useAddressHistory";

export function useUpdateAddressHistory() {
  const { addressHistory, setResults } = useAddressHistory();
  const { contractAddress, isAddressValid } = useContractAddress();

  useEffect(() => {
    if (
      contractAddress &&
      isAddressValid &&
      !addressHistory.find((item) => item === contractAddress)
    ) {
      setResults([...addressHistory, contractAddress]);
    }
  }, [contractAddress]);
}
