import { useParams } from "react-router-dom";
import { Address } from "ton";
import { SearchRequest } from "../components/AddressInput";

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

export { useContractAddress, validateAddress, checkForDuplicatedValues };
