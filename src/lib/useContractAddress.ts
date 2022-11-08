import { Address } from "ton";
import { useParams } from "react-router-dom";

export function useContractAddress() {
  const { contractAddress } = useParams();
  let isAddressValid = true;

  try {
    Address.parse(contractAddress ?? "");
  } catch (e) {
    isAddressValid = false;
  }

  return {
    contractAddress,
    isAddressValid,
  };
}
