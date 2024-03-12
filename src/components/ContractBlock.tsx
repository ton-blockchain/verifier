import React, { useState } from "react";
import { useContractAddress } from "../lib/useContractAddress";
import { useLoadContractInfo } from "../lib/useLoadContractInfo";
import contractIcon from "../assets/contract.svg";
import { DataBlock, DataRowItem } from "./DataBlock";
import { useLoadContractProof } from "../lib/useLoadContractProof";
import { workchainForAddress } from "../lib/workchainForAddress";
import { formatBalance } from "../utils/numberUtils";
import { useEffect } from "react";

function useToggle<T>(valA: T, valB: T): [T, () => void] {
  const [state, setState] = useState(valA);

  useEffect(() => {
    setState(valA);
  }, [valA, valB]);

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
  const [displayCodeCellHash, toggleDisplayCodeCellHash] = useToggle(
    data?.codeCellHash.base64,
    data?.codeCellHash.hex,
  );
  const [displayDataCellHash, toggleDisplayDataCellHash] = useToggle(
    data?.dataCellHash.base64,
    data?.dataCellHash.hex,
  );

  const [displayLibraryHash, toggleDisplayLibraryHash] = useToggle(
    data?.libraryHash.base64,
    data?.libraryHash.hex,
  );

  if (data) {
    dataRows.push({
      title: "Address",
      value: displayAddress ?? "",
      showIcon: true,
      onClick: () => {
        toggleDisplayAddress();
      },
      tooltip: true,
      subtitle: workchainForAddress(contractAddress || ""),
    });
    dataRows.push({
      title: "Balance",
      value: `${formatBalance.format(parseFloat(data.balance))} TON`,
    });
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
      title: "Data Hash",
      value: displayDataCellHash ?? "",
      showIcon: true,
      onClick: () => {
        toggleDisplayDataCellHash();
      },
      tooltip: true,
    });

    if (data?.libraryHash.base64) {
      dataRows.push({
        title: "Library Code Cell Hash",
        value: displayLibraryHash ?? "",
        showIcon: true,
        onClick: () => {
          toggleDisplayLibraryHash();
        },
        tooltip: true,
      });
      dataRows.push({
        title: "",
        value: "",
        showIcon: true,
      });
    }
  }

  return (
    <DataBlock
      title="Contract"
      icon={contractIcon}
      dataRows={dataRows}
      isLoading={isLoading}
      isFlexibleWrapper={!!proofData?.hasOnchainProof}
    />
  );
}
