import { Address, Cell, TonClient } from "ton";
import { SourcesRegistry as SourcesRegistryContract } from "./wrappers/sources-registry";

export async function getAdmin(sourcesRegistry: Address, tonClient: TonClient) {
  const contract = tonClient.open(SourcesRegistryContract.createFromAddress(sourcesRegistry));
  const adminAddress = await contract.getAdminAddress();
  return adminAddress?.toString();
}
