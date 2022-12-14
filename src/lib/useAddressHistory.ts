import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddressInput } from "./useAddressInput";
import { persist } from "zustand/middleware";
import create from "zustand";
import { useContractAddress } from "./useContractAddress";

interface AddressHistoryState {
  addresses: string[];
  addAddress: (address: string) => void;
  clear: () => void;
  removeItem: (address: string) => void;
}

export const useAddressHistoryStore = create<AddressHistoryState>()(
  persist(
    (set, get) => ({
      addresses: [],
      addAddress: (address: string) => {
        if (get().addresses.includes(address)) return;
        return set({ addresses: [address, ...get().addresses].slice(0, 20) });
      },
      clear: () => set({ addresses: [] }),
      removeItem: (address: string) => {
        const { addresses } = get();
        const newAddresses = addresses.filter((item) => item !== address);
        set({ addresses: newAddresses });
      },
    }),
    {
      name: "addressHistory",
      getStorage: () => localStorage,
    },
  ),
);

export function useAddressHistory() {
  const navigate = useNavigate();
  const { setValue, setActive } = useAddressInput();
  const { addresses, addAddress, clear, removeItem } = useAddressHistoryStore();
  const { contractAddress } = useContractAddress();

  const onHistoryClear = useCallback(() => {
    clear();
  }, [clear]);

  const onItemClick = useCallback((item: string) => {
    setValue("");
    setActive(false);
    navigate(`/${item}`);
  }, []);

  const onItemDelete = useCallback(
    (e: React.MouseEvent, item: string) => {
      e.stopPropagation();
      removeItem(item);
    },
    [removeItem],
  );

  useEffect(() => {
    if (contractAddress) {
      addAddress(contractAddress);
    }
  }, [contractAddress]);

  return { onHistoryClear, onItemClick, onItemDelete, addressHistory: addresses, addAddress };
}
