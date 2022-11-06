import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Cell, Address, toNano } from "ton";
import { useSubmitSources } from "./useSubmitSources";
import { useWalletConnect } from "./useWalletConnect";

export function usePublishProof() {
  const { data } = useSubmitSources();
  const { requestTXN } = useWalletConnect();
  const [txnStatus, setTxnStatus] = useState<
    | "pending"
    | "success"
    | "rejected"
    | "expired"
    | "invalid_session"
    | "not_issued"
  >("not_issued");

  return useMutation(async () => {
    if (!data?.result.msgCell) return;

    const txnRespP = requestTXN(
      import.meta.env.VITE_VERIFIER_REGISTRY,
      toNano(0.1),
      Cell.fromBoc(Buffer.from(data.result.msgCell!))[0] // .data?,
    );
    setTxnStatus("pending");

    const resp = await txnRespP;

    if (resp === undefined) {
      return "invalid_session";
    }

    setTxnStatus(resp!.type);

    return txnStatus;
  });
}
