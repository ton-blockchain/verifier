import { useParams } from "react-router-dom";
import { Address } from "ton";
import { useEffect } from "react";
import { useNavigatePreserveQuery } from "./useNavigatePreserveQuery";

function useContractAddress() {
  const navigate = useNavigatePreserveQuery();
  const { contractAddress } = useParams();
  const isAddressValid = validateAddress(contractAddress);
  const verifiedAddress = isAddressValid ? Address.parse(contractAddress!) : null;

  const verifiedAddressStr = verifiedAddress?.toString() ?? null;
  const verifiedAddresssHex = verifiedAddress?.toRawString() ?? null;

  useEffect(() => {
    if (contractAddress && verifiedAddress && verifiedAddressStr !== contractAddress) {
      navigate(`/${verifiedAddressStr}`, { replace: true });
    }
  }, [contractAddress]);

  return {
    contractAddress: verifiedAddressStr,
    contractAddressHex: verifiedAddresssHex,
    isAddressEmpty: !contractAddress,
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
