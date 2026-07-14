import { useCallback } from "react";
import useNotification from "./useNotification";
import { Address } from "@ton/ton";
import create from "zustand";
import { useNavigatePreserveQuery } from "./useNavigatePreserveQuery";

interface Props {
  value: string;
  active: boolean;
  setValue: (val: string) => void;
  setActive: (act: boolean) => void;
}

const useAddressStore = create<Props>((set) => ({
  value: "",
  active: false,
  setValue: (val: string) => set({ value: val }),
  setActive: (act: boolean) => set({ active: act }),
}));

export function useAddressInput() {
  const { showNotification } = useNotification();
  const navigate = useNavigatePreserveQuery();
  const { value, setValue, active, setActive } = useAddressStore((state) => state);

  const onClear = useCallback(() => {
    setValue("");
  }, []);

  const navigateToAddress = (address: string, isTestnet: boolean) => {
    setValue("");
    setActive(false);
    navigate({ pathname: `/${value}`, search: (isTestnet && "testnet") || "" });
  };

  const onSubmit = () => {
    try {
      const address = Address.parseFriendly(value);
      navigateToAddress(value, address.isTestOnly);
    } catch (errParseFriendly) {
      try {
        const _ = Address.parseRaw(value);
        navigateToAddress(value, false);
      } catch (errParseRaw) {
        showNotification(`Invalid address: ${errParseFriendly} / ${errParseRaw}`, "error");
      }
    }
  };

  return {
    onSubmit,
    onClear,
    setActive: setActive,
    setValue: setValue,
    active: active,
    value: value,
  };
}
