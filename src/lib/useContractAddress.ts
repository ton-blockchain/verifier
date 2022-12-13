import { useNavigate, useParams } from "react-router-dom";
import { Address } from "ton";
import { useEffect } from "react";

function useContractAddress() {
  const navigate = useNavigate();
  const { contractAddress } = useParams();
  let isAddressValid = validateAddress(contractAddress);

  useEffect(() => {
    if (isAddressValid) {
      navigate(`/${Address.parse(contractAddress ?? "").toFriendly()}`, { replace: true });
    }
  }, [contractAddress]);

  return {
    contractAddress,
    isAddressValid,
  };
}

function validateAddress(contractAddress: string | undefined) {
  let isAddressValid = true;

  try {
    Address.parse(contractAddress ?? "").toFriendly();
  } catch (e) {
    isAddressValid = false;
  }

  return isAddressValid;
}

export { useContractAddress, validateAddress };
