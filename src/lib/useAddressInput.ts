import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateAddress } from "../utils/textUtils";
import useNotification from "./useNotification";

export function useAddressInput() {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [active, setActive] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

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
    setActive,
    setValue,
    active,
    value,
  };
}
