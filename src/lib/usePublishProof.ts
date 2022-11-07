import { useMutation } from "@tanstack/react-query";
import BN from "bn.js";
import { useState, useEffect } from "react";
import { Cell, Address, toNano, parseTransaction } from "ton";
import { getClient } from "./getClient";
import { useSendTXN, TXNStatus } from "./useSendTxn";
import { useSubmitSources } from "./useSubmitSources";
import { useWalletConnect } from "./useWalletConnect";
import { useLoadContractProof } from "./useLoadContractProof";

export function usePublishProof() {
  const { data } = useSubmitSources();
  const { invalidate, data: contractProofData } = useLoadContractProof();

  const m = useSendTXN(
    Address.parse(import.meta.env.VITE_VERIFIER_REGISTRY),
    toNano(0.1),
    data ? Cell.fromBoc(Buffer.from(data!.result.msgCell!))[0] : new Cell()
  );
  const sleep = async (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    if (m.data.status === "success") {
      let i = 0;
      (async () => {
        while (!contractProofData?.hasOnchainProof && i < 20) {
          i++;
          await sleep(2000);
          invalidate();
        }
      })();
    }
  }, [m.data.status]);

  return {
    mutate: m.mutate,
    status: contractProofData?.hasOnchainProof
      ? "deployed"
      : (m.data.status as TXNStatus | "deployed"),
  };
}
