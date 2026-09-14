import { Address, fromNano, Cell, CellType, BitReader } from "@ton/ton";
import { useQuery } from "@tanstack/react-query";

import { AssemblyWriter, disassembleRoot, Cell as OpcodeCell } from "@tact-lang/opcode";
import { useClient } from "./useClient";
import { useContractAddress } from "./useContractAddress";

type CellHash = {
  base64: string;
  hex: string;
};

export type ContractInfo = {
  codeCellHash: CellHash;
  dataCellHash: CellHash;
  decompiled: string;
  balance: string;
  libraryHash: {
    base64?: string;
    hex?: string;
  };
  codeCellToCompileBase64: string;
};

export function tryLoadLibraryCodeCellHash(exoticCodeCell: Cell) {
  if (exoticCodeCell.isExotic && exoticCodeCell.type == CellType.Library) {
    const br = new BitReader(exoticCodeCell.bits);
    br.loadBits(8);
    return Buffer.from(br.loadBits(br.remaining).toString(), "hex");
  }

  return null;
}

export function useLoadContractInfo(): {
  isLoading: boolean;
  error: unknown;
  data: ContractInfo | null | undefined;
} {
  const { contractAddress } = useContractAddress();
  const client = useClient();

  const { isLoading, error, data } = useQuery<ContractInfo | null>({
    queryKey: [contractAddress, "info"],
    enabled: !!client,
    refetchOnMount: false,
    queryFn: async () => {
      if (!client) throw new Error("Client is not initialized");
      if (!contractAddress) return null;

      const _address = Address.parse(contractAddress);
      let { code, data, state } = await client.getContractState(_address);
      if (state === "uninitialized") {
        return null;
      }
      let codeCell = Cell.fromBoc(code!)[0];
      let dataCell = Cell.fromBoc(data!)[0];

      const b = await client.getBalance(_address);

      const libraryHash = tryLoadLibraryCodeCellHash(codeCell);

      let decompiled = "Unable to decompile";

      if (libraryHash) {
        decompiled = "Library contract";
      } else {
        try {
          const opcodeCodeCell = OpcodeCell.fromBoc(codeCell.toBoc())[0];
          const program = disassembleRoot(opcodeCodeCell, { computeRefs: true });
          decompiled = AssemblyWriter.write(program, { withoutHeader: true });
        } catch (e) {
          decompiled = e instanceof Error ? e.toString() : String(e);
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
    },
  });

  return { isLoading, error, data };
}
