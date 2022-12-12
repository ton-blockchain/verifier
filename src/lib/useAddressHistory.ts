import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAddressInput } from "./useAddressInput";
import { useLocalStorage } from "./useLocalStorage";

export function useAddressHistory() {
  const navigate = useNavigate();
  const { setValue, setActive } = useAddressInput();
  const { storedValue, setValue: setResults } = useLocalStorage<string[]>("searchBarResults", []);

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

  return { onHistoryClear, onItemClick, onItemDelete, addressHistory: storedValue, setResults };
}
