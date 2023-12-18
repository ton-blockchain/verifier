import { useQuery } from "@tanstack/react-query";
import { Address } from "ton";
import { getClient } from "./getClient";
import { VerifierRegistry as VerifierRegistryContract } from "./wrappers/verifier-registry";
import { useLoadSourcesRegistryInfo } from "./useLoadSourcesRegistryInfo";

export function useLoadVerifierRegistryInfo() {
  const { data: sourceRegistryData } = useLoadSourcesRegistryInfo();
  return useQuery(["verifierRegistry", sourceRegistryData?.verifierRegistry], async () => {
    const tc = await getClient();
    const contract = tc.open(
      VerifierRegistryContract.createFromAddress(
        Address.parse(sourceRegistryData!.verifierRegistry),
      ),
    );
    const verifiers = await contract.getVerifiers();
    return verifiers;
  });
}
