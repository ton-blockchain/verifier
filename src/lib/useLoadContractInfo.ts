import { Address, fromNano, Cell } from "ton";
import { useQuery } from "@tanstack/react-query";

import { fromCode } from "tvm-disassembler";
import { getClient } from "./getClient";
import { useContractAddress } from "./useContractAddress";

type CellHash = {
  base64: string;
  hex: string;
};

export function useLoadContractInfo() {
  const { contractAddress } = useContractAddress();

  const { isLoading, error, data } = useQuery([contractAddress, "info"], async () => {
    if (!contractAddress) return null;
    const client = await getClient();

    const _address = Address.parse(contractAddress);
    let { code, data } = await client.getContractState(_address);
    let codeCell = Cell.fromBoc(code!)[0];
    let dataCell = Cell.fromBoc(data!)[0];

    const b = await client.getBalance(_address);

    let decompiled;
    try {
      decompiled = fromCode(codeCell);
    } catch (e) {
      decompiled = e?.toString();
    }

    const codeCellHash = codeCell.hash();
    const dataCellHash = dataCell.hash();

    return {
      codeCellHash: {
        base64: codeCellHash.toString("base64"),
        hex: codeCellHash.toString("hex"),
      } as CellHash,
      dataCellHash: {
        base64: dataCellHash.toString("base64"),
        hex: dataCellHash.toString("hex"),
      } as CellHash,
      decompiled,
      balance: fromNano(b),
    };
  });

  return { isLoading, error, data };
}
