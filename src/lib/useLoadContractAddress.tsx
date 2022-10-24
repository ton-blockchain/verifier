import { useEffect } from "react";

import { TonClient, Address, fromNano } from "ton";
import { getHttpEndpoint } from "@orbs-network/ton-gateway";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { fromCode } from "tvm-disassembler";
import { Cell as DisassmeblerCell } from "tvm-disassembler/node_modules/ton";

export function useLoadContractAddress() {
  const { contractAddress } = useParams();

  const { isLoading, error, data } = useQuery([contractAddress], async () => {
    if (!contractAddress) return;

    const endpoint = await getHttpEndpoint();
    const client = new TonClient({ endpoint });
    const _address = Address.parse(contractAddress);
    let { code } = await client.getContractState(_address);
    let codeCell = DisassmeblerCell.fromBoc(code!)[0];

    const b = await client.getBalance(_address);

    return {
      hash: codeCell.hash().toString("base64"),
      decompiled: fromCode(codeCell),
      balance: fromNano(b),
    };
  });

  return { isLoading, error, data };
}
