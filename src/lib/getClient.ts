import { TonClient } from "ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";

declare global {
  interface Window {
    isTestnet: boolean;
    verifierRegistryAddress: string;
    sourcesRegistryAddress: string;
    verifierId: string;
  }
}

window.isTestnet = new URLSearchParams(window.location.search).has("testnet");

window.sourcesRegistryAddress = window.isTestnet
  ? import.meta.env.VITE_SOURCES_REGISTRY_TESTNET
  : import.meta.env.VITE_SOURCES_REGISTRY;

window.verifierId = window.isTestnet
  ? import.meta.env.VITE_VERIFIER_ID_TESTNET
  : import.meta.env.VITE_VERIFIER_ID;

const endpointP = getHttpEndpoint({ network: window.isTestnet ? "testnet" : "mainnet" });

export async function getEndpoint() {
  return endpointP;
}

async function _getClient() {
  return new TonClient({
    endpoint: await getEndpoint(),
  });
}

const clientP = _getClient();

export async function getClient() {
  return clientP;
}
