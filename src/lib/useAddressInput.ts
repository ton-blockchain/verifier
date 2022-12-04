import React, { useCallback, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { SEARCH_HISTORY } from "../const";
import { SearchRequest } from "../components/AddressInput";
import { isValidAddress } from "../utils";
import useNotification from "./useNotification";
import { useNavigate } from "react-router-dom";

export function useAddressInput() {
  const [value, setValue] = useState("");
  const [active, setActive] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [searchResults, setSearchResults] = useState<SearchRequest[]>([]);
  const { storedValue: searchDupResults, setValue: setSearchDupResults } = useLocalStorage<
    SearchRequest[]
  >(SEARCH_HISTORY, []);

  const defineActive = (value: boolean) => setActive(value);

  const defineValue = (value: string) => setValue(value);

  const defineSearchDupResults = (results: SearchRequest[]) => setSearchDupResults(results);

  const onClear = useCallback(() => setValue(""), []);

  const onItemClick = useCallback((item: SearchRequest) => {
    setActive(false);
    navigate(`/${item.value}`);
  }, []);

  const onHistoryClear = useCallback(() => {
    setSearchResults([]);
  }, []);

  const onItemDelete = useCallback(
    (e: React.MouseEvent, item: SearchRequest) => {
      e.stopPropagation();
      setSearchResults((prev) => prev.filter((result) => result.value !== item.value));
    },
    [searchResults],
  );

  const onSubmit = async () => {
    const isAlreadyInTheList = searchDupResults.find((item) => {
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
      setSearchResults((prevState) => [...prevState, { index: searchDupResults?.length, value }]);

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
    defineActive,
    defineValue,
    defineSearchDupResults,
  };
}
