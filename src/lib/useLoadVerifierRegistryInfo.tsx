import { useQuery } from "@tanstack/react-query";
import { Address } from "ton";
import { getClient } from "./getClient";
import { VerifierRegistry as VerifierRegistryContract } from "./wrappers/verifier-registry";

export function useLoadVerifierRegistryInfo() {
  const address = Address.parse(window.verifierRegistryAddress);
  return useQuery(["verifierRegistry", address], async () => {
    const tc = await getClient();
    const contract = tc.open(VerifierRegistryContract.createFromAddress(address));
    const verifiers = await contract.getVerifiers();
    return verifiers;
  });
}
