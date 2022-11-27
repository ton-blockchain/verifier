import React from "react";
import { useContractAddress } from "../lib/useContractAddress";
import { useLoadContractInfo } from "../lib/useLoadContractInfo";
import contractIcon from "../assets/contract.svg";
import { DataBlock, DataRowItem } from "./DataBlock";
import { useLoadContractProof } from "../lib/useLoadContractProof";
import { workchainForAddress } from "../lib/workchainForAddress";

export function ContractBlock() {
  const { contractAddress } = useContractAddress();
  const { data, isLoading } = useLoadContractInfo();
  const { data: proofData } = useLoadContractProof();
  const dataRows: DataRowItem[] = [];

  if (data) {
    dataRows.push({ title: "Address", value: contractAddress || "", showIcon: true });
    dataRows.push({ title: "Workchain", value: workchainForAddress(contractAddress || "") });
    dataRows.push({ title: "Code Hash", value: data.hash, showIcon: true });
    dataRows.push({ title: "Balance", value: `${parseFloat(data.balance).toFixed(4)} TON` });
  }

  return (
    <DataBlock
      title="Contract"
      icon={contractIcon}
      dataRows={dataRows}
      isLoading={isLoading}
      isFlexibleWrapper={proofData && proofData.hasOnchainProof}
    />
  );
}
