import { AppPopup } from "./AppPopup";
import { useLoadContractProof } from "../lib/useLoadContractProof";
import { useLoadVerifierRegistryInfo } from "../lib/useLoadVerifierRegistryInfo";
import { githubLink } from "../const";
import { CenteringBox, TitleText } from "./Common.styled";
import {
  Box,
  ClickAwayListener,
  IconButton,
  List,
  ListItem,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import close from "../assets/close.svg";
import verificationPopup from "../assets/verification-popup.svg";
import React, { ReactNode, useCallback } from "react";
import TableBody from "@mui/material/TableBody";
import useNotification from "../lib/useNotification";
import { downloadJson } from "../utils/jsonUtils";
import {
  CloseButtonWrapper,
  CommandEllipsisLabel,
  PopupLink,
  PopupTable,
  PopupTableTitle,
  PopupWrapper,
} from "./VerificationProofPopup.styled";
import {
  VerificationProofPopupTableDataRow,
  VerificationProofPopupTableHead,
  VerificationProofPopupTableSkeletonRow,
} from "./VerificationProofPopupTable";

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
    <Box sx={{ overflow: "scroll", borderRadius: "5px" }}>
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
  const theme = useTheme();
  const headerSpacings = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <AppPopup open={true} maxWidth={headerSpacings ? "88%" : 1000} hideCloseButton>
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
