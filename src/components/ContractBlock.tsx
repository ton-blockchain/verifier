import React, { useState } from "react";
import { useContractAddress } from "../lib/useContractAddress";
import { useLoadContractInfo } from "../lib/useLoadContractInfo";
import contractIcon from "../assets/contract.svg";
import { DataBlock, DataRowItem } from "./DataBlock";
import { workchainForAddress } from "../lib/workchainForAddress";
import { formatBalance } from "../utils/numberUtils";
import { useEffect } from "react";
import { SkeletonBox } from "./SkeletonBox";

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
  const { data, isLoading, error } = useLoadContractInfo();

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

  const dataRows = React.useMemo(() => {
    if (error) {
      {
        return [
          {
            title: "Error",
            value: String(error),
          },
        ];
      }
    }
    let rows: DataRowItem[] = [
      {
        title: "Address",
        value: displayAddress ?? "",
        showIcon: true,
        onClick: () => {
          toggleDisplayAddress();
        },
        tooltip: true,
        subtitle: workchainForAddress(contractAddress || ""),
      },
    ];

    if (!data) {
      rows.push({
        title: "State",
        value: "uninitialized",
      });
      return rows;
    }

    rows = [
      ...rows,
      {
        title: "Balance",
        value: `${formatBalance.format(parseFloat(data.balance))} TON`,
      },
      {
        title: "Code Hash",
        value: displayCodeCellHash ?? "",
        showIcon: true,
        onClick: () => {
          toggleDisplayCodeCellHash();
        },
        tooltip: true,
      },
      {
        title: "Data Hash",
        value: displayDataCellHash ?? "",
        showIcon: true,
        onClick: () => {
          toggleDisplayDataCellHash();
        },
        tooltip: true,
      },
    ];

    if (data?.libraryHash.base64) {
      rows = [
        ...rows,
        {
          title: "Library Code Cell Hash",
          value: displayLibraryHash ?? "",
          showIcon: true,
          onClick: () => {
            toggleDisplayLibraryHash();
          },
          tooltip: true,
        },
      ];
    }

    return rows;
  }, [
    data,
    error,
    displayAddress,
    displayCodeCellHash,
    displayDataCellHash,
    displayLibraryHash,
    contractAddress,
  ]);

  if (isLoading) {
    return <SkeletonBox content={false} />;
  }

  return (
    <DataBlock
      title="Contract"
      icon={contractIcon}
      dataRows={dataRows}
      isLoading={isLoading}
      isFlexibleWrapper
    />
  );
}
