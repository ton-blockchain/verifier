import { useQuery } from "@tanstack/react-query";
import BN from "bn.js";
import { Address, Cell } from "ton";
import { getClient } from "./getClient";
import { makeGetCall } from "./makeGetCall";

function num2ip(num: BN) {
  let d = num.toBuffer();
  return [d[0].toString(), d[1].toString(), d[2].toString(), d[3].toString()].join(".");
}

export type VerifierConfig = {
  admin: string;
  quorum: string;
  pubKeyEndpoints: {
    [k: string]: string;
  };
  name: string;
  url: string;
};

export function useLoadVerifierRegistryInfo() {
  const address = Address.parse(import.meta.env.VITE_VERIFIER_REGISTRY);
  return useQuery(["verifierRegistry", address], async () => {
    const tc = await getClient();
    const verifierConfig = await makeGetCall(
      address,
      "get_verifiers",
      [],
      (s) =>
        (s[0] as Cell).beginParse().readDict(256, (s) => ({
          admin: s.readAddress()!.toFriendly(),
          quorum: s.readInt(8).toString(),
          pubKeyEndpoints: Object.fromEntries(
            Array.from(s.readDict(256, (pkE) => num2ip(pkE.readUint(32))).entries()).map(
              ([k, v]) => [new BN(k).toBuffer().toString("base64"), v.toString()],
            ),
          ),
          name: s.readRef().readRemainingBytes().toString(),
          url: s.readRef().readRemainingBytes().toString(),
        })),
      tc,
    );

    return Array.from(verifierConfig.values()) as VerifierConfig[];
  });
}
