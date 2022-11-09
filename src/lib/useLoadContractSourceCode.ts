import { SourcesData } from "@ton-community/contract-verifier-sdk";
import { useLoadContractProof } from "./useLoadContractProof";
import { useEffect, useState } from "react";

export function useLoadContractSourceCode() {
  const { data } = useLoadContractProof();

  useEffect(() => {
    if (!data?.files) return;
    ContractVerifierUI.loadSourcesData(data as SourcesData, {
      containerSelector: "#myVerifierContainer",
      fileListSelector: "#myVerifierFiles",
      contentSelector: "#myVerifierContent",
      theme: "light", // TODO denis
    });
  }, [data?.files]);

  return {
    hasOnchainProof: data?.hasOnchainProof,
  };
}
