import { useEffect } from "react";
import { Cell, Address, toNano } from "ton";
import { useSendTXN, TXNStatus } from "./useSendTxn";
import { useSubmitSources } from "./useSubmitSources";
import { useLoadContractProof } from "./useLoadContractProof";

export function usePublishProof() {
  const { data } = useSubmitSources();
  const { invalidate, data: contractProofData } = useLoadContractProof();

  const m = useSendTXN(
    Address.parse(import.meta.env.VITE_VERIFIER_REGISTRY),
    toNano(0.1),
    data?.result?.msgCell ? Cell.fromBoc(Buffer.from(data.result.msgCell))[0] : new Cell(), // TODO this is a hack
  );
  const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
