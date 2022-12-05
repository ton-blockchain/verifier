import React, { useCallback, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { SEARCH_HISTORY } from "../const";
import { SearchRequest } from "../components/AddressInput";
import { isValidAddress } from "../utils";
import useNotification from "./useNotification";
import { useNavigate } from "react-router-dom";

export function useAddressInput() {
  const [value, _setValue] = useState("");
  const [active, _setActive] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const { storedValue: searchResults, setValue: setSearchResults } = useLocalStorage<
    SearchRequest[]
  >(SEARCH_HISTORY, []);

  const setActive = (value: boolean) => _setActive(value);

  const setValue = (value: string) => _setValue(value);

  const onClear = useCallback(() => setValue(""), []);

  const onItemClick = useCallback((item: SearchRequest) => {
    setActive(false);
    navigate(`/${item.value}`);
  }, []);

  const onHistoryClear = useCallback(() => {
    setSearchResults([]);
  }, []);

  const onItemAdd = useCallback(
    (value: string) => {
      if (!isValidAddress(value)) {
        return;
      }

      const isAlreadyInTheList = searchResults.find((item) => {
        return item.value === value;
      });

      !isAlreadyInTheList &&
        setSearchResults((prevState) => [...prevState, { index: searchResults?.length, value }]);
    },
    [searchResults],
  );

  const onItemDelete = useCallback(
    (e: React.MouseEvent, item: SearchRequest) => {
      e.stopPropagation();
      setSearchResults((prev) => prev.filter((result) => result.value !== item.value));
    },
    [searchResults],
  );

  const onSubmit = async () => {
    const isAlreadyInTheList = searchResults.find((item) => {
      return item.value === value;
    });

    if (!value) {
      setValue("");
      setActive(false);
      navigate("/");
      return;
    }

    if (!isValidAddress(value)) {
      showNotification("Invalid address", "error");
      return;
    }

    !isAlreadyInTheList &&
      setSearchResults((prevState) => [...prevState, { index: searchResults?.length, value }]);

    setValue("");
    setActive(false);
    navigate(`/${value}`);
  };

  return {
    onSubmit,
    onClear,
    onHistoryClear,
    onItemClick,
    onItemDelete,
    active,
    searchResults,
    value,
    setActive,
    setValue,
    onItemAdd,
  };
}
