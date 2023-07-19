import { useMutation } from "@tanstack/react-query";
import { Address, Cell, fromNano } from "ton";
import { getClient } from "../getClient";
import { sendAnalyticsEvent, AnalyticsAction } from "../googleAnalytics";
import { makeGetCall } from "../makeGetCall";
import { useContractAddress } from "../useContractAddress";
import { useGetters, StateGetter } from "./useGetters";
import { beginCell } from "ton";

export type PossibleRepresentation = "address" | "coins" | "base64" | "boc" | "int" | "raw" | "hex";

export type GetterResponseValue = { type: PossibleRepresentation; value: string };

export function useQueryGetter(getter: StateGetter) {
  const { contractAddress } = useContractAddress();
  const { getters } = useGetters();

  return useMutation([contractAddress, "getter", getter.name], async () => {
    const tc = await getClient();
    if (!contractAddress) return;
    if (!getters) return;

    sendAnalyticsEvent(AnalyticsAction.RUN_GETTER);

    const resp = makeGetCall(
      Address.parse(contractAddress),
      getter.name,
      getter.parameters.map((param) => {
        const type = param.possibleTypes[param.selectedTypeIdx];
        switch (type) {
          case "int":
            return BigInt(param.value);
          case "address":
            return beginCell().storeAddress(Address.parse(param.value)).endCell();
          default:
            return Cell.fromBoc(Buffer.from(param.value, "base64"))[0];
        }
      }),
      (s) => {
        return s.map((value) => {
          const possibleRepresentations: { type: PossibleRepresentation; value: string }[] = [];
          if (value instanceof Cell) {
            try {
              if (value.beginParse().remainingBits === 267) {
                possibleRepresentations.push({
                  type: "address",
                  value: value.beginParse().loadAddress()!.toString(),
                });
              }
            } catch (e) {
              // Ignore
            }

            possibleRepresentations.push({
              type: "base64",
              value: value.toBoc().toString("base64"),
            });
            possibleRepresentations.push({ type: "boc", value: value.toString() });
          } else if (typeof value === "bigint") {
            possibleRepresentations.push({ type: "int", value: value.toString() });
            possibleRepresentations.push({ type: "coins", value: fromNano(value) });
            possibleRepresentations.push({ type: "hex", value: value.toString(16) });
            possibleRepresentations.push({
              type: "base64",
              value: Buffer.from(value.toString(16), "hex").toString("base64"),
            });
          } else {
            possibleRepresentations.push({ type: "raw", value: String(value) });
          }

          return possibleRepresentations as GetterResponseValue[];
        });
      },
      tc,
    );

    return resp;
  });
}
