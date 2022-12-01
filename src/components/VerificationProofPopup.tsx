import { AppPopup } from "./AppPopup";
import { useLoadContractProof } from "../lib/useLoadContractProof";
import { useLoadVerifierRegistryInfo } from "../lib/useLoadVerifierRegistryInfo";
import { githubLink } from "../const";
import { CenteringBox, TitleText } from "./common.styled";
import {
  Box,
  ClickAwayListener,
  IconButton,
  List,
  ListItem,
  Skeleton,
  Typography,
} from "@mui/material";
import verified from "../assets/verified.svg";
import copy from "../assets/copy.svg";
import close from "../assets/close.svg";
import verificationPopup from "../assets/verification-popup.svg";
import React, { ReactNode, useCallback } from "react";
import TableRow from "@mui/material/TableRow";
import { BorderLessCell, HR } from "./fileTable.styled";
import TableBody from "@mui/material/TableBody";
import useNotification from "../lib/useNotification";
import { downloadJson } from "../utils/jsonUtils";
import {
  CloseButtonWrapper,
  CommandEllipsisLabel,
  PopupLink,
  PopupTable,
  PopupTableBodyCell,
  PopupTableHead,
  PopupTableHeadCell,
  PopupTableHeadPaddingCell,
  PopupTableHeadRow,
  PopupTableTitle,
  PopupTableTypography,
  PopupWrapper,
  VerifiedTag,
} from "./VerificationProofPopup.styled";

function ProofTable() {
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
  // contractProofData?.verificationDate
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
    <>
      {contractProofData && verifierConfig && (
        <PopupTable>
          <PopupTableHead>
            <PopupTableHeadRow>
              <PopupTableHeadCell sx={{ width: 80, paddingLeft: 3 }}>Status</PopupTableHeadCell>
              <PopupTableHeadCell sx={{ width: 370 }}>Public Key</PopupTableHeadCell>
              <PopupTableHeadCell sx={{ width: 35 }}></PopupTableHeadCell>
              <PopupTableHeadCell>IP</PopupTableHeadCell>
              <PopupTableHeadCell>Verification date</PopupTableHeadCell>
              <PopupTableHeadCell>Verifier</PopupTableHeadCell>
            </PopupTableHeadRow>
            <TableRow>
              <PopupTableHeadPaddingCell>
                <HR />
              </PopupTableHeadPaddingCell>
              <PopupTableHeadPaddingCell>
                <HR />
              </PopupTableHeadPaddingCell>
              <PopupTableHeadPaddingCell>
                <HR />
              </PopupTableHeadPaddingCell>
              <PopupTableHeadPaddingCell>
                <HR />
              </PopupTableHeadPaddingCell>
              <PopupTableHeadPaddingCell>
                <HR />
              </PopupTableHeadPaddingCell>
              <PopupTableHeadPaddingCell>
                <HR />
              </PopupTableHeadPaddingCell>
            </TableRow>
          </PopupTableHead>
          <TableBody>
            {Object.entries(verifierConfig.pubKeyEndpoints).map(([pubKey, endpoint]) => {
              return (
                <TableRow key={pubKey}>
                  <BorderLessCell sx={{ paddingLeft: 3, paddingBottom: 2 }}>
                    <VerifiedTag px={1}>
                      <img src={verified} alt="Verified icon" width={11} height={11} />
                      Verified
                    </VerifiedTag>
                  </BorderLessCell>
                  <PopupTableBodyCell>
                    <PopupTableTypography>{pubKey}</PopupTableTypography>
                  </PopupTableBodyCell>
                  <PopupTableBodyCell>
                    <IconButton onClick={() => onCopy(pubKey)} sx={{ padding: 0.5 }}>
                      <img src={copy} alt="Copy icon" width={16} height={16} />
                    </IconButton>
                  </PopupTableBodyCell>
                  <PopupTableBodyCell>
                    <PopupTableTypography>{endpoint}</PopupTableTypography>
                  </PopupTableBodyCell>
                  <PopupTableBodyCell>
                    <PopupTableTypography>
                      {contractProofData?.verificationDate?.toLocaleDateString()}
                    </PopupTableTypography>
                  </PopupTableBodyCell>
                  <BorderLessCell sx={{ paddingRight: 3, paddingBottom: 2 }}>
                    <CenteringBox>
                      <PopupLink target="_blank" href={verifierConfig.url}>
                        {verifierConfig.name}
                      </PopupLink>
                    </CenteringBox>
                  </BorderLessCell>
                </TableRow>
              );
            })}
          </TableBody>
        </PopupTable>
      )}
      {(isLoadingProof || isLoadingVerifierRegistry) && (
        <Skeleton
          width="100%"
          height={100}
          sx={{ transform: "none", borderRadius: "20px", background: "#e6e8eb" }}
        />
      )}
      {(!!errorProof || !!errorVerifierRegistry) &&
        `${errorProof} ${errorVerifierRegistry} (App notification)`}
    </>
  );
}

function CommandLabel(props: { children: ReactNode }) {
  return null;
}

function ManualProof() {
  const { data: contractProofData, isLoading } = useLoadContractProof();
  const { isLoading: isLoadingVerifierRegistry } = useLoadVerifierRegistryInfo();

  return (
    <Box sx={{ width: "100%" }}>
      {contractProofData && !isLoadingVerifierRegistry && (
        <PopupWrapper pt={2} pb={1}>
          <PopupTableTitle mb={4}>How to verify manually by yourself?</PopupTableTitle>
          <List sx={{ padding: 0 }}>
            <ListItem sx={{ paddingBottom: 0, paddingTop: 0 }}>
              <Typography
                sx={{
                  fontSize: 14,
                }}>
                1. Install{" "}
                <PopupLink target="_blank" href="https://www.docker.com/">
                  docker
                </PopupLink>{" "}
                on your local machine
              </Typography>
            </ListItem>
            <ListItem sx={{ paddingTop: "7px", paddingBottom: 0 }}>
              <Typography
                sx={{
                  fontSize: 14,
                  lineHeight: "34px",
                  position: "relative",
                }}>
                2. Save this file locally as <CommandLabel>sources.json</CommandLabel> :{" "}
                <CommandEllipsisLabel
                  onClick={() =>
                    !!contractProofData?.ipfsHttpLink &&
                    downloadJson(contractProofData.ipfsHttpLink)
                  }>
                  {contractProofData?.ipfsHttpLink}
                </CommandEllipsisLabel>
              </Typography>
            </ListItem>
            <ListItem sx={{ paddingBottom: "6px", paddingTop: "7px" }}>
              <Typography
                sx={{
                  fontSize: 14,
                }}>
                3. Run in terminal:{" "}
                <CommandLabel>
                  {" "}
                  docker run -i ton-contract-verifier &#60; sources.json{" "}
                </CommandLabel>
              </Typography>
            </ListItem>
            <ListItem>
              <Typography
                sx={{
                  fontSize: 14,
                }}>
                4. Review docker image source here:{" "}
                <CommandLabel>
                  <PopupLink target="_blank" href={githubLink} sx={{ color: "#212121" }}>
                    {githubLink}
                  </PopupLink>
                </CommandLabel>
              </Typography>
            </ListItem>
          </List>
        </PopupWrapper>
      )}
      {(isLoading || isLoadingVerifierRegistry) && (
        <Skeleton
          width="100%"
          height={250}
          sx={{ transform: "none", borderRadius: "20px", background: "#e6e8eb" }}
        />
      )}
    </Box>
  );
}

interface VerificationProofPopupProps {
  onClose: () => void;
}

export function VerificationProofPopup({ onClose }: VerificationProofPopupProps) {
  return (
    <AppPopup open={true} maxWidth={1000} hideCloseButton>
      <ClickAwayListener onClickAway={onClose}>
        <Box sx={{ width: "100%" }}>
          <CloseButtonWrapper pt={2}>
            <IconButton sx={{ padding: 0 }} onClick={onClose}>
              <img src={close} alt="Close icon" width={15} height={15} />
            </IconButton>
          </CloseButtonWrapper>
          <CenteringBox mb={4} justifyContent="center">
            <img src={verificationPopup} alt="Popup icon" width={41} height={41} />
            <TitleText pl={2} sx={{ fontSize: 18, fontWeight: 800 }}>
              Verification Proof
            </TitleText>
          </CenteringBox>
          <ProofTable />
          {/* TODO restore when docker verification is ready <br />
          <ManualProof /> */}
        </Box>
      </ClickAwayListener>
    </AppPopup>
  );
}
