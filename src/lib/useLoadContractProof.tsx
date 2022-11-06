import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Sha256 } from "@aws-crypto/sha256-js";
import { getClient, getEndpoint } from "./getClient";
import { useLoadContractInfo } from "./useLoadContractInfo";
import "@ton-community/contract-verifier-sdk";
import { SourcesData } from "@ton-community/contract-verifier-sdk";
import { useWalletConnect } from "./useWalletConnect";
import { getAdmin } from "../SourcesRegistry";
import { Address } from "ton";

export const toSha256Buffer = (s: string) => {
  const sha = new Sha256();
  sha.update(s);
  return Buffer.from(sha.digestSync());
};

export function useLoadContractProof() {
  const { contractAddress } = useParams();
  const { data: contractInfo } = useLoadContractInfo();
  const [urlParams] = useSearchParams();
  const { walletAddress } = useWalletConnect();

  const { isLoading, error, data } = useQuery<
    Partial<SourcesData> & { hasOnchainProof: boolean }
  >(
    [contractAddress, "proof"],
    async () => {
      if (urlParams.get("override") !== null) {
        const tc = await getClient();
        const admin = await getAdmin(
          Address.parse(import.meta.env.VITE_SOURCES_REGISTRY),
          tc
        );
        if (admin === walletAddress) {
          return { hasOnchainProof: false };
        }
      }

      const ipfslink = await ContractVerifier.getSourcesJsonUrl(
        contractInfo!.hash,
        {
          httpApiEndpoint: await getEndpoint(),
        }
      );

      if (!ipfslink) {
        return { hasOnchainProof: false };
      }

      const sourcesData = await ContractVerifier.getSourcesData(ipfslink);

      return { hasOnchainProof: true, ...sourcesData };
    },
    { enabled: !!contractAddress && !!contractInfo?.hash }
  );

  return { isLoading, error, data };
}
