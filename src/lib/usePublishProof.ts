import { useEffect } from "react";
import { Cell, Address, toNano } from "ton";
import { useSendTXN, TXNStatus } from "./useSendTxn";
import { useSubmitSources } from "./useSubmitSources";
import { useLoadContractProof } from "./useLoadContractProof";
import { useFileStore } from "./useFileStore";
import { useQuery } from "@tanstack/react-query";

export function usePublishProof() {
  const { data } = useSubmitSources();
  const { refetch, data: contractProofData } = useLoadContractProof();
  const { reset: resetFiles } = useFileStore();

  const m = useSendTXN(
    Address.parse(import.meta.env.VITE_VERIFIER_REGISTRY),
    toNano(0.1),
    data?.result?.msgCell ? Cell.fromBoc(Buffer.from(data.result.msgCell))[0] : new Cell(), // TODO this is a hack
  );

  useQuery(
    ["publishProofMonitoring"],
    async () => {
      // TODO add counter to report back an error
      refetch();
      if (contractProofData?.hasOnchainProof) {
        resetFiles();
      }
    },
    {
      enabled: m.data.status === "success" && !contractProofData?.hasOnchainProof,
      refetchInterval: 2000,
    },
  );

  return {
    mutate: m.mutate,
    status: contractProofData?.hasOnchainProof
      ? "deployed"
      : (m.data.status as TXNStatus | "deployed"),
  };
}
