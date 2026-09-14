export type TonNetwork = "mainnet" | "testnet";

const TONCENTER_HTTP_ENDPOINTS: Record<TonNetwork, string> = {
  mainnet: "https://toncenter.com/api/v2/jsonRPC",
  testnet: "https://testnet.toncenter.com/api/v2/jsonRPC",
};

export function getToncenterNetwork(isTestnet: boolean): TonNetwork {
  return isTestnet ? "testnet" : "mainnet";
}

export function getToncenterHttpEndpoint(network: TonNetwork) {
  return TONCENTER_HTTP_ENDPOINTS[network];
}

const MAINNET_API_KEY = "5ba34a188fb71c3e9931b8cef04f1eeb24f8e69fb1482fce4442fb389fcb1700" as const;
const TESTNET_API_KEY = "a30fbbcea6e3541a6252ee0345e7dd5e11ca0abcd3ec2d068eff922ced15cc93" as const;

export function getToncenterClientParams(isTestnet: boolean) {
  const network = getToncenterNetwork(isTestnet);
  const endpoint = getToncenterHttpEndpoint(network);
  const apiKey = network === "mainnet" ? MAINNET_API_KEY : TESTNET_API_KEY;
  return { endpoint, apiKey };
}
