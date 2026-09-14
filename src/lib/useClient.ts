import { Address, TonClient } from "@ton/ton";
import { useMemo } from "react";
import { useIsTestnet } from "../components/TestnetBar";
import { getToncenterClientParams } from "./toncenter";

export function useSourcesRegistryAddress() {
  const isTestnet = useIsTestnet();
  return useMemo(() => {
    return Address.parse(
      isTestnet
        ? import.meta.env.VITE_SOURCES_REGISTRY_TESTNET
        : import.meta.env.VITE_SOURCES_REGISTRY,
    );
  }, [isTestnet]);
}

export function useClient() {
  const isTestnet = useIsTestnet();
  return useMemo(() => {
    const params = getToncenterClientParams(isTestnet);
    return new TonClient(params);
  }, [isTestnet]);
}
