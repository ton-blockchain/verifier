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
    dataRows.push({ title: "Address", value: contractAddress || "" });
    dataRows.push({ title: "Balance", value: `${parseFloat(data.balance).toFixed(4)} TON` });
    dataRows.push({ title: "Hash", value: data.hash });
    dataRows.push({ title: "Workchain", value: workchainForAddress(contractAddress || "") });
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
