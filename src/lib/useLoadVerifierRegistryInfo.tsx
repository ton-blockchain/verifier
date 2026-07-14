import { useQuery } from "@tanstack/react-query";
import { Address } from "@ton/ton";
import { useClient } from "./useClient";
import {
  VerifierRegistry as VerifierRegistryContract,
  VerifierWithId,
} from "./wrappers/verifier-registry";
import { useLoadSourcesRegistryInfo } from "./useLoadSourcesRegistryInfo";

export function useLoadVerifierRegistryInfo() {
  const { data: sourceRegistryData } = useLoadSourcesRegistryInfo();
  const tc = useClient();
  return useQuery<Record<string, VerifierWithId>>({
    enabled: !!sourceRegistryData && !!tc,
    queryKey: ["verifierRegistry", sourceRegistryData?.verifierRegistry],
    refetchOnMount: false,
    queryFn: async () => {
      if (!tc) throw new Error("Client is not initialized");
      const contract = tc.open(
        VerifierRegistryContract.createFromAddress(
          Address.parse(sourceRegistryData!.verifierRegistry),
        ),
      );
      const verifiers = await contract.getVerifiers();
      return verifiers;
    },
  });
}
