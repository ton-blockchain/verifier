import { useQuery } from "@tanstack/react-query";
import { Sha256 } from "@aws-crypto/sha256-js";
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

export async function getProofIpfsLink(hash: string): Promise<string | null> {
  return ContractVerifier.getSourcesJsonUrl(hash, {
    verifier: window.verifierId,
    testnet: window.isTestnet,
  });
}

export function useLoadContractProof() {
  const { contractAddress } = useContractAddress();
  const { data: contractInfo, error: contractError } = useLoadContractInfo();
  const { status: publishProofStatus } = usePublishProof();
  const { isLoading, error, data, refetch } = useQuery<
    Partial<SourcesData> & {
      hasOnchainProof: boolean;
    }
  >(
    [contractAddress, "proof"],
    async () => {
      if (!contractAddress) {
        return {
          hasOnchainProof: false,
        };
      }

      const ipfsLink = await getProofIpfsLink(contractInfo!.codeCellToCompileBase64);

      if (!ipfsLink) {
        return { hasOnchainProof: false, ipfsLink };
      }

      const sourcesData = await ContractVerifier.getSourcesData(ipfsLink, {
        testnet: window.isTestnet,
      });
      return {
        hasOnchainProof: true,
        ...sourcesData,
      };
    },
    {
      enabled:
        !!contractAddress &&
        !!contractInfo?.codeCellToCompileBase64 &&
        publishProofStatus === "initial",
      retry: 2,
    },
  );

  return { isLoading, error: error ?? contractError, data, refetch };
}
