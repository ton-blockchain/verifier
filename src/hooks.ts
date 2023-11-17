import { SendTransactionRequest, useTonConnectUI } from "@tonconnect/ui-react";
import { Cell, StateInit, beginCell, storeStateInit } from "ton";

export const useRequestTXN = () => {
  const [tonConnection] = useTonConnectUI();
  return async (
    to: string,
    value: bigint,
    message?: Cell,
    stateInit?: StateInit,
  ): Promise<"issued" | "rejected"> => {
    try {
      let cell;
      if (stateInit) {
        const builder = beginCell();
        storeStateInit(stateInit)(builder);
        cell = builder.asCell();
      }

      const tx: SendTransactionRequest = {
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: [
          {
            address: to,
            amount: value.toString(),
            stateInit: cell ? cell.toBoc().toString("base64") : undefined,
            payload: message?.toBoc().toString("base64"),
          },
        ],
      };
      await tonConnection.sendTransaction(tx);
      return "issued";
    } catch (e) {
      console.error(e);
      return "rejected";
    }
  };
};
