import { useMutation } from "@tanstack/react-query";
import { Cell, Address, toNano } from "ton";
import { useSubmitSources } from "./useSubmitSources";
import { useWalletConnect } from "./useWalletConnect";

export function usePublishProof() {
  const { data } = useSubmitSources();
  const { requestTXN } = useWalletConnect();

  return useMutation(async () => {
    if (!data?.msgCell) return;

    await requestTXN(
      import.meta.env.VITE_VERIFIER_REGISTRY,
      toNano(0.05),
      Cell.fromBoc(Buffer.from(data.msgCell!))[0] // .data?,
    );
  });
}
