import { useClient, useSourcesRegistryAddress } from "./useClient";
import { Cell } from "@ton/ton";
import { useQuery } from "@tanstack/react-query";
import { getAdmin } from "./getAdmin";
import { SourcesRegistry as SourcesRegistryContract } from "./wrappers/sources-registry";

export function useLoadSourcesRegistryInfo() {
  const address = useSourcesRegistryAddress();
  const tc = useClient();

  return useQuery({
    queryKey: ["sourcesRegistry", address],
    enabled: !!tc,
    refetchOnMount: false,
    queryFn: async () => {
      if (!tc) throw new Error("Client is not initialized");

      const admin = await getAdmin(address, tc);
      const contract = tc.open(SourcesRegistryContract.createFromAddress(address));

      const verifierRegistry = (await contract.getVerifierRegistryAddress()).toString();
      const deploymentCosts = await contract.getDeploymentCosts();

      const codeCellHash = Cell.fromBoc((await tc.getContractState(address)).code as Buffer)[0]
        .hash()
        .toString("base64");
      return {
        admin,
        verifierRegistry,
        codeCellHash,
        address,
        deploymentCosts,
      };
    },
  });
}
