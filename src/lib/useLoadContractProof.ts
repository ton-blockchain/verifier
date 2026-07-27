import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sha256 } from "@aws-crypto/sha256-js";
import { useLoadContractInfo } from "./useLoadContractInfo";
import { useContractAddress } from "./useContractAddress";
import { useIsTestnet } from "../components/TestnetBar";
import { useLoadVerifierRegistryInfo } from "./useLoadVerifierRegistryInfo";
import { VerifierWithId } from "./wrappers/verifier-registry";
import { getSourcesData, SourcesData } from "./getSourcesData";
import { Address, TupleBuilder } from "@ton/core";
import { TonClient } from "@ton/ton";
import { getToncenterClientParams } from "./toncenter";
import { useClient, useSourcesRegistryAddress } from "./useClient";

export const toSha256Buffer = (s: string) => {
  const sha = new Sha256();
  sha.update(s);
  return Buffer.from(sha.digestSync());
};

const DEFAULT_SOURCES_REGISTRY = Address.parse("EQD-BJSVUJviud_Qv7Ymfd3qzXdrmV525e3YDzWQoHIAiInL");
const DEFAULT_SOURCES_REGISTRY_TESTNET = Address.parse(
  "EQCsdKYwUaXkgJkz2l0ol6qT_WxeRbE_wBCwnEybmR0u5TO8",
);

type ProofDependencies = {
  tonClient?: TonClient;
  sourcesRegistry?: Address;
};

function bigIntFromBuffer(buffer: Buffer) {
  return BigInt(`0x${buffer.toString("hex")}`);
}

function resolveTonClient(isTestnet: boolean, client?: TonClient) {
  if (client) {
    return client;
  }
  return new TonClient(getToncenterClientParams(isTestnet));
}

function resolveSourcesRegistry(isTestnet: boolean, address?: Address) {
  if (address) {
    return address;
  }
  const envAddress = isTestnet
    ? import.meta.env.VITE_SOURCES_REGISTRY_TESTNET
    : import.meta.env.VITE_SOURCES_REGISTRY;
  if (envAddress) {
    try {
      return Address.parse(envAddress);
    } catch (error) {
      // Fallback to default registry if env value is invalid.
    }
  }
  return isTestnet ? DEFAULT_SOURCES_REGISTRY_TESTNET : DEFAULT_SOURCES_REGISTRY;
}

export async function getProofIpfsLink(
  hash: string,
  verifier: string,
  isTestnet: boolean,
  deps?: ProofDependencies,
): Promise<string | null> {
  const tonClient = resolveTonClient(isTestnet, deps?.tonClient);
  const sourcesRegistry = resolveSourcesRegistry(isTestnet, deps?.sourcesRegistry);

  const args = new TupleBuilder();
  args.writeNumber(bigIntFromBuffer(toSha256Buffer(verifier)));
  args.writeNumber(bigIntFromBuffer(Buffer.from(hash, "base64")));

  const { stack: addressResult } = await tonClient.runMethod(
    sourcesRegistry,
    "get_source_item_address",
    args.build(),
  );
  const sourceItemAddress = addressResult.readAddress();

  const isDeployed = await tonClient.isContractDeployed(sourceItemAddress);
  if (!isDeployed) {
    return null;
  }

  const { stack: dataResult } = await tonClient.runMethod(
    sourceItemAddress,
    "get_source_item_data",
  );
  const contentCell = dataResult.skip(3).readCell().beginParse();
  const version = contentCell.loadUint(8);
  if (version !== 1) {
    throw new Error("Unsupported version");
  }

  return contentCell.loadStringTail();
}

export type ContractProofData = Partial<SourcesData> & {
  hasOnchainProof: boolean;
};

export type ContractProofMap = Map<string, ContractProofData>;

export async function loadProofData(
  codeCellHashBase64: string,
  verifier: string,
  isTestnet: boolean,
  deps?: ProofDependencies,
) {
  const ipfsLink = await getProofIpfsLink(codeCellHashBase64, verifier, isTestnet, deps);

  if (!ipfsLink) {
    return { hasOnchainProof: false, ipfsLink };
  }

  const sourcesData = await getSourcesData(ipfsLink);
  return {
    hasOnchainProof: true,
    ...sourcesData,
  };
}

export function hasAnyOnchainProof(proofs: ContractProofMap | undefined) {
  if (!proofs) return false;
  for (const proof of proofs.values()) {
    if (proof.hasOnchainProof) {
      return true;
    }
  }
  return false;
}

export function getMissingOnchainProofs(
  proofs: ContractProofMap | undefined,
  registry?: Record<string, VerifierWithId>,
) {
  if (!proofs || !registry) return [];
  return Object.values(registry).filter((verifier) => {
    const proof = proofs.get(verifier.id);
    return !proof?.hasOnchainProof;
  });
}

export function findProofByVerifierName(
  proofs: ContractProofMap | undefined,
  registry: Record<string, VerifierWithId> | undefined,
  verifierName: string,
) {
  if (!proofs || !registry) return undefined;
  const match = Object.entries(registry).find(([, config]) => config.name === verifierName);
  if (!match) return undefined;
  return proofs.get(match[0]);
}

export function getFirstAvailableProof(proofs: ContractProofMap | undefined) {
  if (!proofs) return undefined;
  for (const proof of proofs.values()) {
    if (proof.hasOnchainProof) {
      return proof;
    }
  }
  return proofs.values().next().value;
}

export function useLoadContractProof() {
  const { contractAddress } = useContractAddress() || "";
  const { data: contractInfo, error: contractError } = useLoadContractInfo();
  const { data: verifierRegistry } = useLoadVerifierRegistryInfo();
  const verifierEntries = useMemo(() => Object.entries(verifierRegistry ?? {}), [verifierRegistry]);
  const isTestnet = useIsTestnet();
  const tonClient = useClient();
  const sourcesRegistryAddress = useSourcesRegistryAddress();
  const sourcesRegistryKey = sourcesRegistryAddress.toString();

  const { isLoading, error, data, refetch } = useQuery<ContractProofMap>({
    queryKey: [
      contractAddress,
      verifierEntries.map(([id]) => id).join("|"),
      isTestnet,
      "proofs",
      sourcesRegistryKey,
    ],
    enabled:
      !!contractAddress && !!contractInfo?.codeCellToCompileBase64 && verifierEntries.length > 0,
    retry: 3,
    refetchOnMount: false,
    queryFn: async () => {
      const map = new Map<string, ContractProofData>();
      if (!contractAddress || !contractInfo?.codeCellToCompileBase64) {
        return map;
      }

      await Promise.all(
        verifierEntries.map(async ([id, config]) => {
          const proof = await loadProofData(
            contractInfo.codeCellToCompileBase64,
            config.name,
            isTestnet,
            {
              tonClient,
              sourcesRegistry: sourcesRegistryAddress,
            },
          );
          map.set(id, proof);
        }),
      );
      return map;
    },
  });

  return { isLoading, error: error ?? contractError, data, refetch };
}
