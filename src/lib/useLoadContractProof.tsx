import { useEffect } from "react";

import { Address, Cell, fromNano } from "ton";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sha256 } from "@aws-crypto/sha256-js";
import { getClient, getEndpoint } from "./getClient";
import BN from "bn.js";
import { makeGetCall } from "./makeGetCall";
import { useLoadContractInfo } from "./useLoadContractInfo";
import "@ton-community/contract-verifier-sdk";
import { SourcesData } from "@ton-community/contract-verifier-sdk";

const VERIFIER_ID = import.meta.env.VITE_VERIFIER_ID;
const SOURCES_REGISTRY_CONTRACT = import.meta.env.SOURCES_REGISTRY;

export const toSha256Buffer = (s: string) => {
  const sha = new Sha256();
  sha.update(s);
  return Buffer.from(sha.digestSync());
};

export function useLoadContractProof() {
  const { contractAddress } = useParams();
  const { data: contractInfo } = useLoadContractInfo();

  const { isLoading, error, data } = useQuery<
    Partial<SourcesData> & { hasOnchainProof: boolean }
  >(
    [contractAddress, "proof"],
    async () => {
      // return { hasOnchainProof: false }; // TODO temp

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
