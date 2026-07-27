import { useEffect } from "react";
import { Address, Cell, StateInit } from "@ton/ton";
import create from "zustand";
import { useRequestTXN } from "../hooks";

export type TXNStatus =
  | "initial"
  | "pending"
  | "issued"
  | "rejected"
  | "error"
  | "expired"
  | "success";

export type SendTxnMessage = {
  to: Address;
  value: bigint;
  message?: Cell;
  stateInit?: StateInit;
};

const useTxnMonitors = create<{
  txns: Record<string, TXNStatus>;
  updateTxn: (key: string, txn: TXNStatus) => void;
}>((set, get) => ({
  txns: {},
  updateTxn: (key: string, txn: TXNStatus) => {
    set((state) => ({ txns: { ...get().txns, [key]: txn } }));
  },
}));

/*
TODOs
1. Support a broader API - tonkeeper / ton-connection
2. Ensure connection exists
*/

export function useSendTXN(key: string, monitorSuccess: (count: number) => Promise<TXNStatus>) {
  const requestTXN = useRequestTXN();
  const { updateTxn, txns } = useTxnMonitors();

  useEffect(() => {
    if (!txns[key]) {
      updateTxn(key, "initial");
    }
  }, []);

  return {
    sendTXN: async (messages: SendTxnMessage | SendTxnMessage[]) => {
      const normalized = Array.isArray(messages) ? messages : [messages];
      if (!normalized.length) return;
      updateTxn(key, "pending");
      const status = await requestTXN(
        normalized.map((msg) => ({
          to: msg.to.toString(),
          value: msg.value,
          message: msg.message,
          stateInit: msg.stateInit,
        })),
      );

      let i = 1;

      if (status === "issued") {
        updateTxn(key, "issued");
        const _id = setInterval(async () => {
          const txnStatus = await monitorSuccess(i);
          i++;
          updateTxn(key, txnStatus);
          if (txnStatus !== "issued") {
            clearInterval(_id);
          }
        }, 2000);
      } else if (status === "rejected") {
        updateTxn(key, "rejected");
      }
    },
    data: { status: txns[key] },
    clearTXN: () => {
      updateTxn(key, "initial");
    },
  };
}
