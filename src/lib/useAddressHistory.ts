import React, { useCallback } from "react";
import { SearchRequest } from "../components/AddressInput";
import { useNavigate } from "react-router-dom";
import { useAddressInput } from "./useAddressInput";
import { useLocalStorage } from "./useLocalStorage";

export function useAddressHistory() {
  const navigate = useNavigate();
  const { setValue, setActive } = useAddressInput();
  const { results, setResults } = useLocalStorage();

  const onHistoryClear = useCallback(() => {
    setResults([]);
  }, [results, setResults]);

  const onItemClick = useCallback(
    (item: SearchRequest) => {
      setValue("");
      setActive(false);
      navigate(`/${item.value}`);
    },
    [results, setResults],
  );

  const onItemDelete = useCallback(
    (e: React.MouseEvent, item: SearchRequest) => {
      e.stopPropagation();
      setResults(results.filter((prevItem) => prevItem.value !== item.value));
    },
    [results, setResults],
  );

  return { onHistoryClear, onItemClick, onItemDelete };
}
