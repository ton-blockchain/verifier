import { Address } from "ton";
import { useParams } from "react-router-dom";

function useContractAddress() {
  const { contractAddress } = useParams();
  const validAddress = contractAddress?.trim();

  let isAddressValid = validateAddress(contractAddress);

  return {
    validAddress,
    isAddressValid,
  };
}

function validateAddress(contractAddress: string | undefined) {
  let isAddressValid = true;

  try {
    Address.parse(contractAddress ?? "");
  } catch (e) {
    isAddressValid = false;
  }

  return isAddressValid;
}

export { useContractAddress, validateAddress };
