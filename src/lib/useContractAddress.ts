import { useNavigate, useParams } from "react-router-dom";
import { Address } from "ton";
import { useEffect } from "react";

function useContractAddress() {
  const navigate = useNavigate();
  const { contractAddress } = useParams();
  let isAddressValid = validateAddress(contractAddress);

  let verifiedAddress = isAddressValid ? Address.parse(contractAddress ?? "").toFriendly() : "";

  useEffect(() => {
    if (isAddressValid) {
      navigate(`/${verifiedAddress}`, { replace: true });
    }
  }, [contractAddress]);

  return {
    contractAddress: verifiedAddress,
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
