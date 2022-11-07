import { useParams, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sha256 } from "@aws-crypto/sha256-js";
import { getClient, getEndpoint } from "./getClient";
import { useLoadContractInfo } from "./useLoadContractInfo";
import "@ton-community/contract-verifier-sdk";
import { SourcesData } from "@ton-community/contract-verifier-sdk";
import { useWalletConnect } from "./useWalletConnect";
import { getAdmin } from "./getAdmin";
import { Address } from "ton";
import { useFileStore } from './useFileStore';

export const toSha256Buffer = (s: string) => {
  const sha = new Sha256();
  sha.update(s);
  return Buffer.from(sha.digestSync());
};

let i = 0;

export function useLoadContractProof() {
  const { contractAddress } = useParams();
  const { data: contractInfo } = useLoadContractInfo();
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery<
    Partial<SourcesData> & { hasOnchainProof: boolean }
  >(
    [contractAddress, "proof"],
    async () => {
      const ipfslink = await ContractVerifier.getSourcesJsonUrl(
        contractInfo!.hash,
        {
          httpApiEndpoint: await getEndpoint(),
        }
      );

      // TODO temp
      if (!ipfslink || i < 8) {
        i++;
        return { hasOnchainProof: false };
      }

      const sourcesData = await ContractVerifier.getSourcesData(ipfslink);
      
      return { hasOnchainProof: true, ...sourcesData };
    },
    { enabled: !!contractAddress && !!contractInfo?.hash }
  );

  const invalidate = () => {
    queryClient.invalidateQueries([contractAddress, "proof"]);
  };

  return { isLoading, error, data, invalidate };
}
