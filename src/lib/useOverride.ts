import { useSearchParams } from "react-router-dom";
import { Address } from "@ton/ton";
import { getAdmin } from "./getAdmin";
import { useClient } from "./useClient";
import { useEffect, useState } from "react";
import { useContractAddress } from "./useContractAddress";
import { useTonAddress } from "@tonconnect/ui-react";
import { useSourcesRegistryAddress } from "./useClient";

export function useOverride() {
  const { contractAddress } = useContractAddress();
  const walletAddress = useTonAddress();
  const [urlParams] = useSearchParams();
  const [canOverride, setCanOverride] = useState(false);
  const sourcesRegistryAddress = useSourcesRegistryAddress();
  const tc = useClient();

  useEffect(() => {
    (async () => {
      if (!tc) return;
      if (!walletAddress || !contractAddress) return;
      if (urlParams.get("override") !== null) {
        const admin = await getAdmin(sourcesRegistryAddress, tc);
        if (admin === walletAddress) {
          setCanOverride(true);
          return;
        }
      }
      setCanOverride(false);
    })();
  }, [walletAddress, contractAddress, tc]);

  return canOverride;
}
