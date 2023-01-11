import React, { useCallback } from "react";
import { useLoadContractProof } from "../lib/useLoadContractProof";
import { useLoadVerifierRegistryInfo } from "../lib/useLoadVerifierRegistryInfo";
import useNotification from "../lib/useNotification";
import { Box } from "@mui/material";
import { PopupTable } from "./VerificationProofPopup.styled";
import {
  VerificationProofPopupTableDataRow,
  VerificationProofPopupTableHead,
  VerificationProofPopupTableSkeletonRow,
} from "./VerificationProofPopupTable";
import TableBody from "@mui/material/TableBody";

export function VerificationProofTable() {
  const {
    data: contractProofData,
    isLoading: isLoadingProof,
    error: errorProof,
  } = useLoadContractProof();
  const {
    data: verifierRegistryInfo,
    isLoading: isLoadingVerifierRegistry,
    error: errorVerifierRegistry,
  } = useLoadVerifierRegistryInfo();
  const { showNotification } = useNotification();

  // TODO this supports a single verifier Id for now.
  // when we wish to support multiple verifiers, load contract proof would have to address that
  const verifierConfig = verifierRegistryInfo?.find(
    (v) => v.name === import.meta.env.VITE_VERIFIER_ID,
  );

  const onCopy = useCallback(async (value: string) => {
    navigator.clipboard.writeText(value);
    showNotification("Copied to clipboard!", "success");
  }, []);

  return (
    <Box
      sx={{
        overflow: "scroll",
        borderRadius: "5px",
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}>
      <PopupTable sx={{ minWidth: 900 }}>
        <VerificationProofPopupTableHead />
        <TableBody>
          {isLoadingProof || isLoadingVerifierRegistry ? (
            <>
              <VerificationProofPopupTableSkeletonRow />
              <VerificationProofPopupTableSkeletonRow />
            </>
          ) : (
            verifierConfig &&
            contractProofData &&
            Object.entries(verifierConfig.pubKeyEndpoints).map(([pubKey, endpoint]) => {
              return (
                <VerificationProofPopupTableDataRow
                  key={pubKey}
                  pubKey={pubKey}
                  onCopy={onCopy}
                  url={verifierConfig.url}
                  date={contractProofData?.verificationDate?.toLocaleDateString() || ""}
                  endpoint={endpoint}
                  name={verifierConfig.name}
                />
              );
            })
          )}
        </TableBody>
      </PopupTable>
      {(!!errorProof || !!errorVerifierRegistry) &&
        `${errorProof} ${errorVerifierRegistry} (App notification)`}
    </Box>
  );
}
