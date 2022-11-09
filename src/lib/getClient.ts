import { TonClient } from "ton";
import { getHttpEndpoint } from "@orbs-network/ton-gateway";

const endpointP = getHttpEndpoint();

async function _getClient() {
  return new TonClient({
    endpoint: await endpointP,
  });
}

const clientP = _getClient();

export async function getClient() {
  return clientP;
}

export async function getEndpoint() {
  return endpointP;
}
