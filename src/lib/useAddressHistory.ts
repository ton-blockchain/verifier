import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddressInput } from "./useAddressInput";
import { useLocalStorage } from "./useLocalStorage";
import { useContractAddress } from "./useContractAddress";

export function useAddressHistory() {
  const navigate = useNavigate();
  const { setValue, setActive } = useAddressInput();
  const { storedValue, setValue: setResults } = useLocalStorage<string[]>("searchBarResults", []);
  const { contractAddress, isAddressValid } = useContractAddress();

  const onHistoryClear = useCallback(() => {
    setResults([]);
  }, [storedValue, setResults]);

  const onItemClick = useCallback(
    (item: string) => {
      setValue("");
      setActive(false);
      navigate(`/${item}`);
    },
    [storedValue, setResults],
  );

  const onItemDelete = useCallback(
    (e: React.MouseEvent, item: string) => {
      e.stopPropagation();
      setResults(storedValue.filter((prevItem) => prevItem !== item));
    },
    [storedValue, setResults],
  );

  useEffect(() => {
    if (
      contractAddress &&
      isAddressValid &&
      !storedValue.find((item) => item === contractAddress)
    ) {
      setResults([...storedValue, contractAddress]);
    }
  }, [contractAddress]);

  return { onHistoryClear, onItemClick, onItemDelete, addressHistory: storedValue };
}
