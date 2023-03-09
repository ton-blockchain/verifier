import { TonClient } from "ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";

declare global {
  interface Window {
    isTestnet: boolean;
  }
}

window.isTestnet = new URLSearchParams(window.location.search).has("testnet");

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
