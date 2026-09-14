import { Cell, Address, toNano } from "@ton/ton";
import { getProofIpfsLink } from "./useLoadContractProof";
import { useLoadContractInfo } from "./useLoadContractInfo";
import { useSendTXN } from "./useSendTxn";
import { AnalyticsAction, sendAnalyticsEvent } from "./googleAnalytics";
import { useEffect, useState } from "react";
import { useLoadSourcesRegistryInfo } from "./useLoadSourcesRegistryInfo";
import { useIsTestnet } from "../components/TestnetBar";
import { useClient, useSourcesRegistryAddress } from "./useClient";

type PublishPayload = {
  verifier: string;
  msgCell: Buffer;
};

export function usePublishProof() {
  const { data: contractInfo } = useLoadContractInfo();
  const { data: sourcesRegistryData } = useLoadSourcesRegistryInfo();
  const isTestnet = useIsTestnet();
  const [verifiersInFlight, setVerifiersInFlight] = useState<string[]>([]);
  const tonClient = useClient();
  const fallbackSourcesRegistry = useSourcesRegistryAddress();
  const sourcesRegistryAddress = sourcesRegistryData?.address ?? fallbackSourcesRegistry;

  const { sendTXN, data, clearTXN } = useSendTXN("publishProof", async (count: number) => {
    if (!contractInfo?.codeCellToCompileBase64) {
      return "error";
    }
    if (verifiersInFlight.length === 0) {
      return "initial";
    }

    if (count > 20) {
      return "error";
    }

    const proofs = await Promise.all(
      verifiersInFlight.map((verifier) =>
        getProofIpfsLink(contractInfo.codeCellToCompileBase64, verifier, isTestnet, {
          tonClient,
          sourcesRegistry: sourcesRegistryAddress,
        }),
      ),
    );

    return proofs.every(Boolean) ? "success" : "issued";
  });

  useEffect(() => {
    switch (data.status) {
      case "pending":
        sendAnalyticsEvent(AnalyticsAction.PUBLISH_CLICK);
        break;
      case "issued":
        sendAnalyticsEvent(AnalyticsAction.TRANSACTION_ISSUED);
        break;
      case "rejected":
        sendAnalyticsEvent(AnalyticsAction.TRANSACTION_REJECTED);
        break;
      case "error":
        sendAnalyticsEvent(AnalyticsAction.TRANSACTION_ERROR);
        break;
      case "expired":
        sendAnalyticsEvent(AnalyticsAction.TRANSACTION_EXPIRED);
        break;
      case "success":
        sendAnalyticsEvent(AnalyticsAction.CONTRACT_DEPLOYED);
        break;
    }
  }, [data.status]);

  return {
    sendProofs: (payloads: PublishPayload[]) => {
      if (!sourcesRegistryData || payloads.length === 0) return;
      setVerifiersInFlight(payloads.map((p) => p.verifier));
      const to = Address.parse(sourcesRegistryData.verifierRegistry);
      const value = import.meta.env.DEV ? toNano("0.1") : toNano("0.5");
      sendTXN(
        payloads.map((payload) => ({
          to,
          value,
          message: Cell.fromBoc(Buffer.from(payload.msgCell))[0],
        })),
      );
    },
    status: data.status,
    clearTXN: () => {
      setVerifiersInFlight([]);
      clearTXN();
    },
  };
}
