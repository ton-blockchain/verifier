import React, { useCallback, useEffect } from "react";
import { SearchRequest } from "../components/AddressInput";
import { useNavigate } from "react-router-dom";
import { useAddressInput } from "./useAddressInput";
import { useLocalStorage } from "./useLocalStorage";
import { useContractAddress, checkForDuplicatedValues } from "./useContractAddress";

export function useAddressHistory() {
  const navigate = useNavigate();
  const { setValue, setActive } = useAddressInput();
  const { storedValue, setValue: setResults } = useLocalStorage<SearchRequest[]>(
    "searchBarResults",
    [],
  );
  const { contractAddress, isAddressValid } = useContractAddress();

  const onHistoryClear = useCallback(() => {
    setResults([]);
  }, [storedValue, setResults]);

  const onItemClick = useCallback(
    (item: SearchRequest) => {
      setValue("");
      setActive(false);
      navigate(`/${item.value}`);
    },
    [storedValue, setResults],
  );

  const onItemDelete = useCallback(
    (e: React.MouseEvent, item: SearchRequest) => {
      e.stopPropagation();
      setResults(storedValue.filter((prevItem) => prevItem.value !== item.value));
    },
    [storedValue, setResults],
  );

  useEffect(() => {
    if (
      contractAddress &&
      isAddressValid &&
      !checkForDuplicatedValues(storedValue, contractAddress)
    ) {
      setResults([...storedValue, { index: storedValue.length, value: contractAddress }]);
    }
  }, [contractAddress]);

  return { onHistoryClear, onItemClick, onItemDelete, storedValue };
}
