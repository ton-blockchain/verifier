import { useState } from "react";
import { SearchRequest } from "../components/AddressInput";

export function useLocalStorage() {
  const initialValue: SearchRequest[] = [];
  const [results, _setResults] = useState<SearchRequest[]>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem("searchResults");
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setResults = (value: SearchRequest[] | ((val: SearchRequest[]) => SearchRequest[])) => {
    try {
      const valueToStore = value instanceof Function ? value(results) : value;
      _setResults(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("searchResults", JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return { results, setResults };
}
