import { Address, beginCell } from "ton";

export const isValidAddress = (address: string, errorText?: string) => {
  try {
    const result = Address.parse(address);
    if (result && result.toFriendly() === zeroAddress().toFriendly()) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export function zeroAddress(): Address {
  return beginCell()
    .storeUint(2, 2)
    .storeUint(0, 1)
    .storeUint(0, 8)
    .storeUint(0, 256)
    .endCell()
    .beginParse()
    .readAddress() as Address;
}
