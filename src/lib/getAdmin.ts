import { makeGetCall } from "./makeGetCall";
import { Address, Cell, TonClient } from "ton";


export async function getAdmin(sourcesRegistry: Address, tonClient: TonClient) {
  return makeGetCall(
    sourcesRegistry,
    "get_admin_address",
    [],
    (s) => (s[0] as Cell).beginParse().readAddress()!.toFriendly(),
    tonClient
  );
}
