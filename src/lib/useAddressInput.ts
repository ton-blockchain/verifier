import React, { useCallback, useEffect, useState } from "react";
import { SearchRequest } from "../components/AddressInput";
import { useNavigate } from "react-router-dom";
import { useContractAddress, validateAddress } from "./useContractAddress";
import useNotification from "./useNotification";
import { useLocalStorage } from "./useLocalStorage";

export function useAddressInput() {
  const { storedValue: results, setValue: setResults } = useLocalStorage<SearchRequest[]>(
    "searchResults",
    [],
  );
  const [value, setValue] = useState<string | undefined>(undefined);
  const [active, setActive] = useState(false);

  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const address = useContractAddress();

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

  const onClear = useCallback(() => {
    setValue("");
  }, []);

  const onSubmit = async () => {
    if (!validateAddress(value)) {
      showNotification("Invalid address", "error");
      return;
    }

    setValue("");
    setActive(false);

    navigate(`/${value}`);
  };

  useEffect(() => {
    const listener = (event: any) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        event.target.blur();
        onSubmit();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [value, onSubmit]);

  useEffect(() => {
    if (address.validAddress && address.isAddressValid) {
      const isAlreadyInTheList = results.find((item) => {
        return item.value === address.validAddress;
      });

      if (isAlreadyInTheList) {
        return;
      }

      setResults([...results, { index: results.length, value: address.validAddress }]);
    }
  }, [address.validAddress]);

  return {
    onSubmit,
    onClear,
    setActive,
    setValue,
    active,
    value,
    results,
    setResults,
    onHistoryClear,
    onItemClick,
    onItemDelete,
  };
}
