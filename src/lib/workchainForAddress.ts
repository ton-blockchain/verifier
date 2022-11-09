import { Address } from "ton";

export function workchainForAddress(address: string): string {
  try {
    const _address = Address.parse(address);
    switch (_address.workChain) {
      case -1:
        return "Masterchain";
      case 0:
        return "Basic Workchain";
      default:
        return `${_address.workChain}`;
    }
  } catch (e) {
    return "";
  }
}
