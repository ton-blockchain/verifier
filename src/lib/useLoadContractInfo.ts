import { Address, fromNano, Cell, CellType, BitReader, beginCell, BitString } from "ton";
import { useQuery } from "@tanstack/react-query";

import { fromCode } from "tvm-disassembler";
import { getClient } from "./getClient";
import { useContractAddress } from "./useContractAddress";

type CellHash = {
  base64: string;
  hex: string;
};

export function tryLoadLibraryCodeCellHash(exoticCodeCell: Cell) {
  if (exoticCodeCell.isExotic && exoticCodeCell.type == CellType.Library) {
    const br = new BitReader(exoticCodeCell.bits);
    br.loadBits(8);
    return Buffer.from(br.loadBits(br.remaining).toString(), "hex");
  }

  return null;
}

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

    const libraryHash = tryLoadLibraryCodeCellHash(codeCell);

    let decompiled;

    if (libraryHash) {
      decompiled = "Library contract";
    } else {
      try {
        decompiled = fromCode(codeCell);
      } catch (e) {
        decompiled = e?.toString();
      }
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
      libraryHash: {
        base64: libraryHash?.toString("base64"),
        hex: libraryHash?.toString("hex"),
      },
      codeCellToCompileBase64: (libraryHash ?? codeCellHash).toString("base64"),
    };
  });

  return { isLoading, error, data };
}
