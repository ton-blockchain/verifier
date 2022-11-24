import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sha256 } from "@aws-crypto/sha256-js";
import { getEndpoint } from "./getClient";
import { useLoadContractInfo } from "./useLoadContractInfo";
import "@ton-community/contract-verifier-sdk";
import { SourcesData } from "@ton-community/contract-verifier-sdk";
import { useContractAddress } from "./useContractAddress";
import { usePublishProof } from "./usePublishProof";

export const toSha256Buffer = (s: string) => {
  const sha = new Sha256();
  sha.update(s);
  return Buffer.from(sha.digestSync());
};

export async function hasOnchainProof(hash: string): Promise<string | null> {
  return ContractVerifier.getSourcesJsonUrl(hash, {
    httpApiEndpoint: await getEndpoint(),
  });
}

export function useLoadContractProof() {
  const { contractAddress, isAddressValid } = useContractAddress();
  const { data: contractInfo, error: contractError } = useLoadContractInfo();
  const { status: publishProofStatus } = usePublishProof();
  const { isLoading, error, data, refetch } = useQuery<
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

      const ipfslink = await hasOnchainProof(contractInfo!.hash);

      if (!ipfslink) {
        return { hasOnchainProof: false };
      }

      const sourcesData = await ContractVerifier.getSourcesData(ipfslink);
      return {
        hasOnchainProof: true,
        ...sourcesData,
      };
    },
    {
      enabled: !!contractAddress && !!contractInfo?.hash && publishProofStatus === "initial",
    },
  );

  return { isLoading, error: error ?? contractError, data, refetch };
}
