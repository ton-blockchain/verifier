import { Address } from "ton";
import { SearchRequest } from "../components/AddressInput";

const makeElipsisAddress = (address?: string | null, padding?: number): string => {
  const paddingValue = padding || 10;
  if (!address) return "";
  const firstPart = address.substring(0, paddingValue);
  const secondPart = address.substring(address.length - paddingValue);
  return `${firstPart}...${secondPart}`;
};

const trimDirectory = (str: string): string =>
  str
    .replace(/\/+/g, "/")
    .replace(/^\/[^\/]/, "")
    .replace(/\/$/, "");

function validateAddress(contractAddress: string | undefined) {
  let isAddressValid = true;

  try {
    Address.parse(contractAddress ?? "");
  } catch (e) {
    isAddressValid = false;
  }

  return isAddressValid;
}

function checkForDuplicatedValues(results: SearchRequest[], address: string) {
  return results.find((item) => {
    return item.value === address;
  });
}

export { makeElipsisAddress, trimDirectory, validateAddress, checkForDuplicatedValues };
