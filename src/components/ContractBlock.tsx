import React from "react";
import { useContractAddress } from "../lib/useContractAddress";
import { useLoadContractInfo } from "../lib/useLoadContractInfo";
import contractIcon from "../assets/contract.svg";
import { DataBlock, DataRowItem } from "./DataBlock";
import { useLoadContractProof } from "../lib/useLoadContractProof";

export function ContractBlock() {
  const { contractAddress } = useContractAddress();
  const { data, isLoading } = useLoadContractInfo();
  const { data: proofData } = useLoadContractProof();

  const dataRows: DataRowItem[] = [];

  contractAddress && dataRows.push({ title: "Address", value: contractAddress });

  if (data) {
    for (const [key, val] of Object.entries(data)) {
      if (key !== "decompiled") {
        dataRows.push({ title: key.charAt(0).toUpperCase() + key.slice(1), value: val });
      }
    }
  }

  return (
    <DataBlock
      title="Contract"
      icon={contractIcon}
      dataRows={dataRows}
      isLoading={isLoading}
      showIcons
      isFlexibleWrapper={proofData && proofData.hasOnchainProof}
    />
  );
}
