import { Cell, Address, toNano } from "ton";
import { useSubmitSources } from "./useSubmitSources";
import { hasOnchainProof } from "./useLoadContractProof";
import { useLoadContractInfo } from "./useLoadContractInfo";
import { useSendTXN } from "./useSendTxn";

export function usePublishProof() {
  const { data: submitSourcesData } = useSubmitSources();
  const { data: contractInfo } = useLoadContractInfo();

  const { sendTXN, data, clearTXN } = useSendTXN("publishProof", async (count: number) => {
    const hasIpfsLink = await hasOnchainProof(contractInfo!.hash);

    if (count > 20) {
      return "error";
    }

    return hasIpfsLink ? "success" : "issued";
  });

  return {
    sendTXN: () => {
      sendTXN(
        Address.parse(import.meta.env.VITE_VERIFIER_REGISTRY),
        toNano(0.1),
        Cell.fromBoc(Buffer.from(submitSourcesData!.result.msgCell!))[0],
      );
    },
    status: data.status,
    clearTXN,
  };
}
