import { SendTransactionRequest, useTonConnectUI } from "@tonconnect/ui-react";
import { Cell, StateInit, beginCell, storeStateInit } from "@ton/ton";

type WalletMessage = {
  to: string;
  value: bigint;
  message?: Cell;
  stateInit?: StateInit;
};

export const useRequestTXN = () => {
  const [tonConnection] = useTonConnectUI();
  return async (messages: WalletMessage[]): Promise<"issued" | "rejected"> => {
    try {
      const serialized = messages.map((msg) => {
        let stateInitCell;
        if (msg.stateInit) {
          const builder = beginCell();
          storeStateInit(msg.stateInit)(builder);
          stateInitCell = builder.asCell();
        }
        return {
          address: msg.to,
          amount: msg.value.toString(),
          stateInit: stateInitCell ? stateInitCell.toBoc().toString("base64") : undefined,
          payload: msg.message ? msg.message.toBoc().toString("base64") : undefined,
        };
      });

      const tx: SendTransactionRequest = {
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: serialized,
      };
      await tonConnection.sendTransaction(tx);
      return "issued";
    } catch (e) {
      console.error(e);
      return "rejected";
    }
  };
};
