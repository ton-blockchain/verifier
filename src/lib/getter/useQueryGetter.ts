import { useMutation } from "@tanstack/react-query";
import BN from "bn.js";
import { Address, Cell, fromNano } from "ton";
import { getClient } from "../getClient";
import { sendAnalyticsEvent, AnalyticsAction } from "../googleAnalytics";
import { makeGetCall } from "../makeGetCall";
import { useContractAddress } from "../useContractAddress";
import { useGetters } from "./useGetters";
import { beginCell } from "ton";

export type PossibleRepresentation = "address" | "coins" | "base64" | "boc" | "int" | "raw" | "hex";

export type GetterResponseValue = { type: PossibleRepresentation; value: string };

export function useQueryGetter(name: string) {
  const { contractAddress } = useContractAddress();
  const { getters, getterParams } = useGetters();

  return useMutation(["getter", name], async () => {
    const tc = await getClient();
    if (!contractAddress) return;
    if (!getters) return;

    sendAnalyticsEvent(AnalyticsAction.RUN_GETTER);

    const resp = makeGetCall(
      Address.parse(contractAddress),
      name,
      getterParams[name].map((param, i) => {
        const type = param.possibleTypes[param.selectedTypeIdx];
        switch (type) {
          case "int":
            return new BN(param.value);
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
              if (value.beginParse().remaining === 267) {
                possibleRepresentations.push({
                  type: "address",
                  value: value.beginParse().readAddress()!.toFriendly(),
                });
              }
            } catch (e) {
              // Ignore
            }

            possibleRepresentations.push({
              type: "base64",
              value: value.toBoc().toString("base64"),
            });
            possibleRepresentations.push({ type: "boc", value: value.toDebugString() });
          } else if (value instanceof BN) {
            possibleRepresentations.push({ type: "int", value: value.toString() });
            possibleRepresentations.push({ type: "coins", value: fromNano(value) });
            possibleRepresentations.push({ type: "hex", value: value.toString("hex") });
            possibleRepresentations.push({
              type: "base64",
              value: Buffer.from(value.toString("hex"), "hex").toString("base64"),
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
