import React, { useCallback, useEffect } from "react";
import { SearchRequest } from "../components/AddressInput";
import { useNavigate } from "react-router-dom";
import { useContractAddress } from "./useContractAddress";
import { atom, useRecoilState } from "recoil";
import useNotification from "./useNotification";
import { isValidAddress } from "../utils/validation";

interface SearchBarAtomProps {
  value: string;
  active: boolean;
  searchResults: SearchRequest[];
}

const searchBarAtom = atom<SearchBarAtomProps>({
  key: "searchBar",
  default: {
    value: "",
    active: false,
    searchResults: [],
  },
});

export function useAddressInput() {
  const [searchBar, setSearchBar] = useRecoilState(searchBarAtom);

  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const address = useContractAddress();

  const onClear = useCallback(() => {
    setSearchBar((old) => ({
      ...old,
      value: "",
    }));
  }, []);

  const onHistoryClear = useCallback(() => {
    setSearchBar((old) => ({
      ...old,
      searchResults: [],
    }));
  }, []);

  const onItemClick = useCallback((item: SearchRequest) => {
    setSearchBar((old) => ({
      ...old,
      value: "",
      active: false,
    }));

    navigate(`/${item.value}`);
  }, []);

  const onItemDelete = useCallback(
    (e: React.MouseEvent, item: SearchRequest) => {
      e.stopPropagation();
      setSearchBar((old) => ({
        ...old,
        searchResults: searchBar.searchResults.filter((prevItem) => prevItem.value !== item.value),
      }));
    },
    [searchBar.searchResults],
  );

  const onSubmit = async () => {
    const isAlreadyInTheList = searchBar.searchResults.find((item) => {
      return item.value === searchBar.value;
    });

    if (!searchBar.value) {
      return;
    }

    if (!isValidAddress(searchBar.value)) {
      showNotification("Invalid jetton address", "error");
      return;
    }

    !isAlreadyInTheList &&
      setSearchBar((old) => ({
        ...old,
        searchResults: [
          ...searchBar.searchResults,
          { index: searchBar.searchResults?.length, value: searchBar.value },
        ],
      }));

    setSearchBar((old) => ({
      ...old,
      value: "",
      active: false,
    }));

    navigate(`/${searchBar.value}`);
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
  }, [searchBar.value, onSubmit]);

  useEffect(() => {
    if (address.contractAddress && address.isAddressValid) {
      const isAlreadyInTheList = searchBar.searchResults.find((item) => {
        return item.value === address.contractAddress;
      });

      !isAlreadyInTheList &&
        setSearchBar((old) => ({
          ...old,
          searchResults: [
            ...searchBar.searchResults,
            { index: searchBar.searchResults?.length, value: address.contractAddress || "" },
          ],
        }));
    }
  }, [address.contractAddress]);

  useEffect(() => {
    setSearchBar((old) => ({
      ...old,
      searchResults: JSON.parse(window.localStorage.getItem("searchBarResults") || "[]"),
    }));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("searchBarResults", JSON.stringify(searchBar.searchResults));
  }, [searchBar.searchResults]);

  return {
    onSubmit,
    onClear,
    onHistoryClear,
    onItemClick,
    onItemDelete,
    searchBar,
    setSearchBar,
  };
}
