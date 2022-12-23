import BN from "bn.js";
import { Address, Cell } from "ton";
import { TonhubConnector } from "ton-x";
import create from "zustand";
import { persist } from "zustand/middleware";
import { Provider } from "../components/ConnectorPopup";
const connector = new TonhubConnector({});

import {
  TonConnection,
  TonhubProvider,
  TonkeeperProvider,
  TonWalletProvider,
} from "@ton-defi.org/ton-connection";
import { useEffect } from "react";

const tonConnection = new TonConnection();

// TODO use TonConnect getWallets, when it becomes de-facto standard
async function makeProvider(
  provider: Provider,
  onLinkReady: (link: string) => void,
): Promise<TonWalletProvider> {
  if (provider === Provider.TONKEEPER) {
    return new TonkeeperProvider({
      connectionDetails: {
        bridgeUrl: "https://bridge.tonapi.io/bridge",
        universalLink: "https://app.tonkeeper.com/ton-connect",
      },
      manifestUrl: "https://tonverifier.live/tonconnect-manifest.json",
      onSessionLinkReady: onLinkReady,
    });
  } else if (provider === Provider.TONHUB) {
    return new TonhubProvider({
      onSessionLinkReady: onLinkReady,
      persistenceProvider: localStorage,
    });
  } else {
    throw new Error("Unsupported provider");
  }
}

export const useProviderStore = create<{
  provider: Provider | null;
  setProvider: (provider: Provider | null) => void;
}>()(
  persist(
    (set, get) => ({
      provider: null,
      setProvider: (provider: Provider | null) => set({ provider }),
    }),
    {
      name: "connectProvider",
      getStorage: () => localStorage,
    },
  ),
);

const useWalletAddressStore = create<{
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
}>((set) => ({
  walletAddress: null,
  setWalletAddress: (address: string | null) => set({ walletAddress: address }),
}));

export function useWalletConnect() {
  const { setProvider, provider } = useProviderStore();
  const { walletAddress, setWalletAddress } = useWalletAddressStore();

  useEffect(() => {
    if (provider && !walletAddress) {
      (async () => {
        const tonWalletProvider = await makeProvider(provider, (l) => {});
        const wallet = await tonWalletProvider.connect();
        if (wallet) {
          setWalletAddress(wallet.address);
          tonConnection.setProvider(tonWalletProvider);
        }
      })();
    }
  }, [provider, walletAddress]);

  return {
    connect: async (provider: Provider, onLinkReady: (link: string) => void) => {
      if (!walletAddress) {
        setProvider(provider);
        const tonWalletProvider = await makeProvider(provider, onLinkReady);
        tonConnection.setProvider(tonWalletProvider);
        const wallet = await tonWalletProvider.connect();
        setWalletAddress(wallet.address);
      }
    },
    requestTXN: async (to: string, value: BN, message: Cell): Promise<"issued" | "rejected"> => {
      try {
        await tonConnection.requestTransaction({
          to: Address.parse(to),
          value,
          message,
        });
        return "issued";
      } catch (e) {
        console.error(e);
        return "rejected";
      }
    },
    walletAddress: walletAddress,
    disconnect: () => {
      tonConnection.setProvider(null);
      setWalletAddress(null);
      setProvider(null);
    },
  };
}
