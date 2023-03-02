import BN from "bn.js";
import { Address, Cell, StateInit } from "ton";
import create from "zustand";
import { persist } from "zustand/middleware";
import { Provider } from "../components/ConnectorPopup";

import {
  MnemonicProvider,
  TonConnection,
  TonhubProvider,
  TonkeeperProvider,
  TonWalletProvider,
} from "@ton-defi.org/ton-connection";
import { getClient } from "./getClient";

const tonConnection = new TonConnection();

// TODO use TonConnect getWallets, when it becomes de-facto standard
async function makeProvider(
  provider: Provider,
  onLinkReady: (link: string) => void,
): Promise<TonWalletProvider> {
  if (provider === Provider.TONKEEPER) {
    return new TonkeeperProvider({
      manifestUrl: "https://tonverifier.live/tonconnect-manifest.json",
      onSessionLinkReady: onLinkReady,
    });
  } else if (provider === Provider.TONHUB) {
    return new TonhubProvider({
      onSessionLinkReady: onLinkReady,
      persistenceProvider: localStorage,
    });
  } else if (provider == Provider.MNEMONIC) {
    const seed = window.prompt("Seed")!;
    const client = await getClient();
    return new MnemonicProvider(seed.split(" "), client, "v3r2");
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

  async function connect(provider: Provider, onLinkReady: (link: string) => void) {
    if (!walletAddress) {
      setProvider(provider);
      const tonWalletProvider = await makeProvider(provider, onLinkReady);
      tonConnection.setProvider(tonWalletProvider);
      const wallet = await tonWalletProvider.connect();
      setWalletAddress(wallet.address);
    }
  }

  return {
    restoreConnection: async () => {
      if (provider) {
        connect(provider, () => {});
      }
    },
    connect: async (provider: Provider, onLinkReady: (link: string) => void) => {
      connect(provider, onLinkReady);
    },
    requestTXN: async (
      to: string,
      value: BN,
      message?: Cell,
      stateInit?: StateInit,
    ): Promise<"issued" | "rejected"> => {
      try {
        await tonConnection.requestTransaction({
          to: Address.parse(to),
          value,
          message,
          stateInit,
        });
        return "issued";
      } catch (e) {
        console.error(e);
        return "rejected";
      }
    },
    walletAddress: walletAddress,
    disconnect: async () => {
      setWalletAddress(null);
      setProvider(null);
      await tonConnection.disconnect();
    },
  };
}
