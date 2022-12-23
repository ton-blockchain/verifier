import BN from "bn.js";
import { useState } from "react";
import { Address, Cell } from "ton";
import {
  TonhubConnector,
  TonhubCreatedSession,
  TonhubSessionAwaited,
  TonhubWalletConfig,
} from "ton-x";
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
import TonConnect from "@tonconnect/sdk";

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

let tonWalletProvider: TonWalletProvider | null = null;
let walletAddress: string | null = null;

const xuseSessionStore = create<{
  session: any;
  setSession: (session: any) => void;
  disconnect: () => void;
}>((set) => ({
  session: JSON.parse(localStorage.getItem("tonhubSession") ?? "null"),
  setSession: (session: any) => {
    localStorage.setItem("tonhubSession", JSON.stringify(session));
    set({ session });
  },
  disconnect: () => {
    localStorage.removeItem("tonhubSession");
    set({ session: null });
  },
}));

export function useWalletConnect() {
  const { setProvider, provider } = useProviderStore();

  return {
    connect: async (provider: Provider, onLinkReady: (link: string) => void) => {
      // TODO restore con
      if (!tonWalletProvider) {
        setProvider(provider);
        tonWalletProvider = await makeProvider(provider, onLinkReady);
        tonConnection.setProvider(tonWalletProvider);
        const wallet = await tonWalletProvider.connect();
        walletAddress = wallet.address;
      }
    },
    requestTXN: async (to: string, value: BN, message: Cell) => {
      tonConnection.requestTransaction({
        to: Address.parse(to),
        value,
        message,
      });
    },
    walletAddress: walletAddress,
    disconnect: () => {
      tonWalletProvider = null;
      // @ts-ignore TODO fix
      tonConnection.setProvider(null);
      setProvider(null);
    },
  };
}
