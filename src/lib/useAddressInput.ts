import { useCallback, useEffect, useState } from "react";
import { SearchRequest } from "../components/AddressInput";
import { useNavigate } from "react-router-dom";
import {
  checkForDuplicatedValues,
  useContractAddress,
  validateAddress,
} from "./useContractAddress";
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

  const onClear = useCallback(() => {
    setValue("");
  }, []);

  const onSubmit = () => {
    const trimmedValue = value?.trim();
    if (!validateAddress(trimmedValue)) {
      showNotification("Invalid address", "error");
      return;
    }

    setValue("");
    setActive(false);

    navigate(`/${trimmedValue}`);
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
    if (
      address.contractAddress &&
      address.isAddressValid &&
      !checkForDuplicatedValues(results, address.contractAddress)
    ) {
      setResults([...results, { index: results.length, value: address.contractAddress }]);
    }
  }, [address.contractAddress]);

  return {
    onSubmit,
    onClear,
    setActive,
    setValue,
    active,
    value,
    results,
    setResults,
  };
}
