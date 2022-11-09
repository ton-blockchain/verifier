import { useSearchParams, useParams } from "react-router-dom";
import { Address } from "ton";
import { getAdmin } from "./getAdmin";
import { getClient } from "./getClient";
import { useWalletConnect } from "./useWalletConnect";
import { useEffect, useState } from "react";
import { useContractAddress } from "./useContractAddress";

export function useOverride() {
  const { contractAddress } = useContractAddress();
  const { walletAddress } = useWalletConnect();
  const [urlParams] = useSearchParams();
  const [canOverride, setCanOverride] = useState(false);

  useEffect(() => {
    (async () => {
      if (urlParams.get("override") !== null) {
        const tc = await getClient();
        const admin = await getAdmin(Address.parse(import.meta.env.VITE_SOURCES_REGISTRY), tc);
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
