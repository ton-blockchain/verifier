import { useEffect, useState, useCallback } from "react";
import { Cell, Address, toNano } from "ton";
import { useSendTXN } from "./useSendTxn";
import { useSubmitSources } from "./useSubmitSources";
import { hasOnchainProof, useLoadContractProof } from "./useLoadContractProof";
import { useFileStore } from "./useFileStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import create from "zustand";
import { useWalletConnect } from "./useWalletConnect";
import { TonhubTransactionResponse } from "ton-x";
import BN from "bn.js";
import { useLoadContractInfo } from "./useLoadContractInfo";
import { getEndpoint } from "./getClient";

export type TXNStatus = "initial" | "pending" | "issued" | "rejected" | "error" | "success";

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
2. Ensure cell is not null
3. Ensure connection exists
*/
function _useSendTXN(key: string, monitorSuccess: () => Promise<TXNStatus>) {
  const { requestTXN } = useWalletConnect();
  const { updateTxn, txns } = useTxnMonitors();

  useEffect(() => {
    updateTxn(key, "initial");
  }, []);

  return {
    sendTXN: async (to: Address, value: BN, message: Cell) => {
      updateTxn(key, "pending");
      const status = await requestTXN(to.toFriendly(), value, message);

      if (status?.type === "success" || true) {
        updateTxn(key, "issued");
        const _id = setInterval(async () => {
          const txnStatus = await monitorSuccess();
          console.log("monitor", txnStatus);
          updateTxn(key, txnStatus);
          if (txnStatus === "success") {
            clearInterval(_id);
          }
        }, 2000);
      } else if (status?.type === "rejected") {
        updateTxn(key, "rejected");
      }
    },
    data: { status: txns[key] },
  };
}

let i = 0;

async function _FAKEHASHONCHAINPROOF() {
  i++;
  console.log(i);
  return i > 10 ? "yes" : null;
}

export function usePublishProof() {
  const { data: submitSourcesData } = useSubmitSources();
  const { reset } = useFileStore();
  const { data: contractInfo } = useLoadContractInfo();

  const { sendTXN, data } = _useSendTXN("publishProof", async () => {
    // const hasIpfsLink = await hasOnchainProof(contractInfo!.hash);
    const hasIpfsLink = !!(await _FAKEHASHONCHAINPROOF());

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
  };
}

// export function useMonitorPublishProof() {
//   const { wasTXNIssued } = useTXNMonitor();
//   // const { refetch, data: contractProofData } = useLoadContractProof();
//   const { refetch, data: contractProofData } = usetempLoadContractProof();
//   const { reset: resetFiles } = useFileStore();
//   const [num, setNum] = useState(0);

//   console.log(num, "in useMonitorPublishProof");

//   useQuery(
//     ["publishProofMonitoring"],
//     async () => {
//       // TODO add counter to report back an error
//       setNum(num + 1);
//       refetch();
//       if (contractProofData?.hasOnchainProof) {
//         console.log(num, "in useMonitorPublishProof: resetting files");
//         resetFiles();
//       }
//       return num;
//     },
//     {
//       enabled: wasTXNIssued, // && !contractProofData?.hasOnchainProof, //&& num < 20,
//       refetchInterval: 2000,
//     },
//   );
// }

// export function usePublishProof() {
//   const { data } = useSubmitSources();
//   const { data: contractProofData } = useLoadContractProof();
//   const { setTXNIssued } = useTXNMonitor();

//   const m = useSendTXN(
//     Address.parse(import.meta.env.VITE_VERIFIER_REGISTRY),
//     toNano(0.1),
//     data?.result?.msgCell ? Cell.fromBoc(Buffer.from(data.result.msgCell))[0] : new Cell(), // TODO this is a hack
//   );

//   useEffect(() => {
//     if (m.data.status === "success") {
//       setTXNIssued();
//     }
//   }, [m.data.status]);

//   return {
//     mutate: m.mutate,
//     status: contractProofData?.hasOnchainProof
//       ? "deployed"
//       : (m.data.status as TXNStatus | "deployed"),
//   };
// }
