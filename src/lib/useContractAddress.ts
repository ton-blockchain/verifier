import { Address } from "ton";
import { useParams } from "react-router-dom";

export function useContractAddress() {
  const { contractAddress } = useParams();
  let isAddressValid = true;

  try {
    validateAddress(contractAddress ?? "");
  } catch (e) {
    isAddressValid = false;
  }

  return {
    contractAddress,
    isAddressValid,
  };
}

export const validateAddress = (address: string) => !!Address.parse(address);
