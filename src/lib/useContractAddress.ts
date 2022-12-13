import { useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();
  let isAddressValid = true;

  try {
    if (contractAddress !== Address.parse(contractAddress ?? "").toFriendly()) {
      navigate(`/${Address.parse(contractAddress ?? "").toFriendly()}`, { replace: true });
    }
  } catch (e) {
    isAddressValid = false;
  }

  return isAddressValid;
}

export { useContractAddress, validateAddress };
