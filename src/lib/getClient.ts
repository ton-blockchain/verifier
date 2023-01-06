import { TonClient } from "ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";

const endpointP = getHttpEndpoint();

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
