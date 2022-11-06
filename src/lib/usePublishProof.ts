import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Cell, Address, toNano, parseTransaction } from "ton";
import { getClient } from "./getClient";
import { useSendTXN } from "./useSendTxn";
import { useSubmitSources } from "./useSubmitSources";
import { useWalletConnect } from "./useWalletConnect";

export function usePublishProof() {
  const { data } = useSubmitSources();
  const { walletAddress } = useWalletConnect();
  // TODO if data is null

  const m = useSendTXN(
    Address.parse(import.meta.env.VITE_VERIFIER_REGISTRY),
    toNano(0.1),
    data ? Cell.fromBoc(Buffer.from(data!.result.msgCell!))[0] : new Cell()
  );

  useEffect(() => {
    (async () => {
      if (m.data.status === "success") {
        const tc = await getClient();
        const walletTxns = await tc.getTransactions(walletAddress, {
          limit: 20,
        });

        

        const txnToVerifier = walletTxns.find(
          (t) =>
            t.outMessages[0].destination ===
            import.meta.env.VITE_VERIFIER_REGISTRY
        );

        // txnToVerifier.

        // tc.isContractDeployed(
        //   Address.parse(import.meta.env.VITE_VERIFIER_REGISTRY)
        // );
      }
    })();
  }, [m.data]);

  return {
    mutate: m.mutate,
  };
}
