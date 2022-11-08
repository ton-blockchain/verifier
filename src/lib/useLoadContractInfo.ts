import { Address, fromNano } from "ton";
import { useQuery } from "@tanstack/react-query";

import { fromCode } from "tvm-disassembler";
import { Cell as DisassmeblerCell } from "tvm-disassembler/node_modules/ton";
import { getClient } from "./getClient";
import { useContractAddress } from "./useContractAddress";

export function useLoadContractInfo() {
  const { contractAddress } = useContractAddress();

  const { isLoading, error, data } = useQuery(
    [contractAddress, "info"],
    async () => {
      if (!contractAddress) return null;
      const client = await getClient();

      const _address = Address.parse(contractAddress);
      let { code } = await client.getContractState(_address);
      let codeCell = DisassmeblerCell.fromBoc(code!)[0];

      const b = await client.getBalance(_address);

      return {
        hash: codeCell.hash().toString("base64"),
        decompiled: fromCode(codeCell),
        balance: fromNano(b),
      };
    }
  );

  return { isLoading, error, data };
}
