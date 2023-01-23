import React, { useState } from "react";
import { useContractAddress } from "../lib/useContractAddress";
import { useLoadContractInfo } from "../lib/useLoadContractInfo";
import contractIcon from "../assets/contract.svg";
import { DataBlock, DataRowItem } from "./DataBlock";
import { useLoadContractProof } from "../lib/useLoadContractProof";
import { workchainForAddress } from "../lib/workchainForAddress";
import { formatBalance } from "../utils/numberUtils";

function useToggle<T>(valA: T, valB: T): [T, () => void] {
  const [state, setState] = useState(valA);

  return [
    state,
    () => {
      setState(state === valA ? valB : valA);
    },
  ];
}

export function ContractBlock() {
  const { contractAddress, contractAddressHex } = useContractAddress();
  const { data, isLoading } = useLoadContractInfo();
  const { data: proofData } = useLoadContractProof();
  const dataRows: DataRowItem[] = [];

  const [displayAddress, toggleDisplayAddress] = useToggle(contractAddress, contractAddressHex);
  const [displayCodeCellHash, toggleDisplayCodeCellHash] = useToggle(data?.hash, data?.hashHex);

  if (data) {
    dataRows.push({
      title: "Address",
      value: displayAddress ?? "",
      showIcon: true,
      onClick: () => {
        toggleDisplayAddress();
      },
      tooltip: true,
    });
    dataRows.push({ title: "Workchain", value: workchainForAddress(contractAddress || "") });
    dataRows.push({
      title: "Code Hash",
      value: displayCodeCellHash ?? "",
      showIcon: true,
      onClick: () => {
        toggleDisplayCodeCellHash();
      },
      tooltip: true,
    });
    dataRows.push({
      title: "Balance",
      value: `${formatBalance.format(parseFloat(data.balance))} TON`,
    });
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
