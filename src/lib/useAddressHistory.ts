import React, { useCallback } from "react";
import { SearchRequest } from "../components/AddressInput";
import { useNavigate } from "react-router-dom";
import { useAddressInput } from "./useAddressInput";

export function useAddressHistory() {
  const navigate = useNavigate();
  const { setValue, setActive, setResults, results } = useAddressInput();

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

  return { onHistoryClear, onItemClick, onItemDelete, results };
}
