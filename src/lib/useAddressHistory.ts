import React, { useCallback } from "react";
import { SearchRequest } from "../components/AddressInput";
import { useNavigate } from "react-router-dom";
import { useAddressInput } from "./useAddressInput";

export function useAddressHistory() {
  const navigate = useNavigate();
  const { setValue, setActive, results, setResults } = useAddressInput();

  const onHistoryClear = useCallback(() => {
    setResults([]);
  }, []);

  const onItemClick = useCallback((item: SearchRequest) => {
    setValue("");
    setActive(false);
    navigate(`/${item.value}`);
  }, []);

  const onItemDelete = useCallback(
    (e: React.MouseEvent, item: SearchRequest) => {
      e.stopPropagation();
      setResults(results.filter((prevItem) => prevItem.value !== item.value));
    },
    [results],
  );

  return { onHistoryClear, onItemClick, onItemDelete };
}
