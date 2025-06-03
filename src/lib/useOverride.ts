import { useSearchParams } from "react-router-dom";
import { Address } from "ton";
import { getAdmin } from "./getAdmin";
import { getClient } from "./getClient";
import { useEffect, useState } from "react";
import { useContractAddress } from "./useContractAddress";
import { useTonAddress } from "@tonconnect/ui-react";

export function useOverride() {
  const { contractAddress } = useContractAddress();
  const walletAddress = useTonAddress();
  const [urlParams] = useSearchParams();
  const [canOverride, setCanOverride] = useState(false);

  useEffect(() => {
    (async () => {
      if (!walletAddress || !contractAddress) return;
      if (urlParams.get("override") !== null) {
        if (!!import.meta.env.VITE_OVERRIDE) {
          setCanOverride(true);
          return;
        }

        const tc = await getClient();
        const admin = await getAdmin(Address.parse(window.sourcesRegistryAddress), tc);
        if (admin === walletAddress) {
          setCanOverride(true);
          return;
        }
      }
      setCanOverride(false);
    })();
  }, [walletAddress, contractAddress]);

  return canOverride;
}
