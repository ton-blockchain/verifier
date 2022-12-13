import { useParams } from "react-router-dom";
import { Address } from "ton";

function useContractAddress() {
  const { contractAddress } = useParams();
  let isAddressValid = validateAddress(contractAddress);

  return {
    contractAddress,
    isAddressValid,
  };
}

function validateAddress(contractAddress: string | undefined) {
  let isAddressValid = true;

  try {
    if (contractAddress?.includes(" ")) {
      location.pathname = `/${Address.parse(contractAddress ?? "").toFriendly()}`;
    }
  } catch (e) {
    isAddressValid = false;
  }

  return isAddressValid;
}

export { useContractAddress, validateAddress };
