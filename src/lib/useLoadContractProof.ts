import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sha256 } from "@aws-crypto/sha256-js";
import { getEndpoint } from "./getClient";
import { useLoadContractInfo } from "./useLoadContractInfo";
import "@ton-community/contract-verifier-sdk";
import { SourcesData } from "@ton-community/contract-verifier-sdk";
import { Address } from "ton";
import { useContractAddress } from "./useContractAddress";

export const toSha256Buffer = (s: string) => {
  const sha = new Sha256();
  sha.update(s);
  return Buffer.from(sha.digestSync());
};

let i = 0;

export function useLoadContractProof() {
  const { contractAddress, isAddressValid } = useContractAddress();
  const { data: contractInfo } = useLoadContractInfo();
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery<
    Partial<SourcesData> & {
      hasOnchainProof: boolean;
    }
  >(
    [contractAddress, "proof"],
    async () => {
      if (!isAddressValid) {
        return {
          hasOnchainProof: false,
        };
      }

      const ipfslink = await ContractVerifier.getSourcesJsonUrl(contractInfo!.hash, {
        httpApiEndpoint: await getEndpoint(),
      });

      // TODO temp
      // if (!ipfslink || i < 3) {
      if (!ipfslink) {
        i++;
        return { hasOnchainProof: false };
      }

      const sourcesData = await ContractVerifier.getSourcesData(ipfslink);

      return {
        hasOnchainProof: true,
        ...sourcesData,
      };
    },
    {
      enabled: !!contractAddress && !!contractInfo?.hash,
    },
  );

  const invalidate = () => {
    queryClient.invalidateQueries([contractAddress, "proof"]);
  };

  return { isLoading, error, data, invalidate };
}
