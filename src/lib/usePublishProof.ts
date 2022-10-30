import { useMutation } from "@tanstack/react-query";
import { Cell, Address, toNano } from "ton";
import { useSubmitSources } from "./useSubmitSources";

export function usePublishProof() {
  const { data } = useSubmitSources();

  return useMutation(async () => {
    if (!data?.msgCell) return;

    const txnParams = {
      message: Cell.fromBoc(Buffer.from(data.msgCell!))[0], // .data?,
      to: Address.parse(import.meta.env.VITE_VERIFIER_REGISTRY),
      value: toNano(0.05),
    };

    console.log(txnParams);

    // await tonConnect.requestTransaction({
    //   to: Address.parse(process.env.REACT_APP_VERIFIER_REGISTRY!),
    //   value: toNano(0.05),
    //   message: cell,
    // });
  });
}
