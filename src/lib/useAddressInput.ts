import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateAddress } from "./useContractAddress";
import useNotification from "./useNotification";
import create from "zustand";

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
  const navigate = useNavigate();
  const { value, setValue, active, setActive } = useAddressStore((state) => state);

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

  return {
    onSubmit,
    onClear,
    setActive: setActive,
    setValue: setValue,
    active: active,
    value: value,
  };
}
