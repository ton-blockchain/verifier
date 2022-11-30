import { AppPopup } from "./AppPopup";
import { useLoadContractProof } from "../lib/useLoadContractProof";
import { useLoadVerifierRegistryInfo } from "../lib/useLoadVerifierRegistryInfo";
import { githubLink } from "../const";
import { CenteringBox, TitleText } from "./common.styled";
import {
  Box,
  ClickAwayListener,
  IconButton,
  Link,
  List,
  ListItem,
  Skeleton,
  Typography,
} from "@mui/material";
import verified from "../assets/verified.svg";
import copy from "../assets/copy.svg";
import close from "../assets/close.svg";
import verificationPopup from "../assets/verification-popup.svg";
import React, { useCallback } from "react";
import { styled } from "@mui/system";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import { BorderLessCell, HeaderCell, HR } from "./fileTable.styled";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import useNotification from "../lib/useNotification";
import { downloadJson } from "../utils/jsonUtils";

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
  console.log(contractProofData);
  return (
    <>
      {contractProofData && verifierConfig && (
        <Table
          sx={{
            background: "#F7F9FB",
            borderRadius: "5px",
            width: "100%",
          }}>
          <TableHead
            sx={{
              "&.MuiTableHead-root th": {
                border: "none",
                fontSize: 13,
              },
            }}>
            <TableRow sx={{ fontWeight: 700 }}>
              <HeaderCell sx={{ width: 80, paddingBottom: "2px", paddingLeft: 3 }}>
                Status
              </HeaderCell>
              <HeaderCell sx={{ paddingLeft: 0, paddingBottom: "2px", width: 370 }}>
                Public Key
              </HeaderCell>
              <HeaderCell sx={{ paddingLeft: 0, paddingBottom: "2px", width: 35 }}></HeaderCell>
              <HeaderCell sx={{ paddingLeft: 0, paddingBottom: "2px" }}>IP</HeaderCell>
              <HeaderCell sx={{ paddingLeft: 0, paddingBottom: "2px" }}>
                Verification date
              </HeaderCell>
              <HeaderCell sx={{ paddingLeft: 0, paddingBottom: "2px" }}>Verifier</HeaderCell>
            </TableRow>
            <TableRow>
              <BorderLessCell sx={{ paddingBottom: 1.2 }}>
                <HR />
              </BorderLessCell>
              <BorderLessCell sx={{ paddingBottom: 1.2 }}>
                <HR />
              </BorderLessCell>
              <BorderLessCell sx={{ paddingBottom: 1.2 }}>
                <HR />
              </BorderLessCell>
              <BorderLessCell sx={{ paddingBottom: 1.2 }}>
                <HR />
              </BorderLessCell>
              <BorderLessCell sx={{ paddingBottom: 1.2 }}>
                <HR />
              </BorderLessCell>
              <BorderLessCell sx={{ paddingBottom: 1.2 }}>
                <HR />
              </BorderLessCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(verifierConfig.pubKeyEndpoints).map(([pubKey, endpoint]) => {
              return (
                <TableRow key={pubKey}>
                  <BorderLessCell sx={{ paddingLeft: 3, paddingBottom: 2 }}>
                    <CenteringBox
                      px={1}
                      sx={{
                        width: 59,
                        height: 21,
                        background: "#08D088",
                        borderRadius: 40,
                        color: "#fff",
                        justifyContent: "space-around",
                      }}>
                      <img src={verified} alt="Verified icon" width={11} height={11} />
                      <Typography sx={{ fontSize: 12 }}>Verified</Typography>
                    </CenteringBox>
                  </BorderLessCell>
                  <BorderLessCell sx={{ paddingBottom: 2 }}>
                    <Typography sx={{ color: "#728A96", fontSize: 14 }}>{pubKey}</Typography>
                  </BorderLessCell>
                  <BorderLessCell sx={{ paddingBottom: 2 }}>
                    <IconButton onClick={() => onCopy(pubKey)} sx={{ padding: 0.5 }}>
                      <img src={copy} alt="Copy icon" width={16} height={16} />
                    </IconButton>
                  </BorderLessCell>
                  <BorderLessCell sx={{ paddingBottom: 2 }}>
                    <Typography sx={{ color: "#728A96", fontSize: 14 }}>{endpoint}</Typography>
                  </BorderLessCell>
                  <BorderLessCell sx={{ paddingBottom: 2 }}>
                    <Typography sx={{ color: "#728A96", fontSize: 14 }}>
                      {contractProofData?.verificationDate?.toLocaleDateString()}
                    </Typography>
                  </BorderLessCell>
                  <BorderLessCell sx={{ paddingRight: 3, paddingBottom: 2 }}>
                    <CenteringBox>
                      <Link
                        target="_blank"
                        href="orbs.com"
                        sx={{
                          textDecoration: "none",
                          cursor: "pointer",
                          color: "#0088CC",
                        }}>
                        orbs.com
                      </Link>
                    </CenteringBox>
                  </BorderLessCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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

function ManualProof() {
  const { data: contractProofData, isLoading } = useLoadContractProof();
  const { isLoading: isLoadingVerifierRegistry } = useLoadVerifierRegistryInfo();

  return (
    <Box sx={{ width: "100%" }}>
      {contractProofData && !isLoadingVerifierRegistry && (
        <Box pt={2} pb={1} sx={{ background: "#F7F9FB", borderRadius: "5px", width: "100%" }}>
          <TitleText
            mb={4}
            sx={{ fontSize: 18, fontWeight: 800, color: "#000", textAlign: "center" }}>
            How to verify manually by yourself?
          </TitleText>
          <List sx={{ padding: 0 }}>
            <ListItem sx={{ paddingBottom: 0, paddingTop: 0 }}>
              <Typography
                sx={{
                  fontSize: 14,
                }}>
                1. Install{" "}
                <Link
                  target="_blank"
                  href="https://www.docker.com/"
                  sx={{
                    textDecoration: "none",
                    cursor: "pointer",
                    color: "#0088CC",
                  }}>
                  docker
                </Link>{" "}
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
                <CommandLabel
                  sx={{
                    position: "relative",
                    top: 5,
                    display: "inline-block",
                    whiteSpace: "nowrap",
                    lineHeight: "20px",
                    width: "100%",
                    maxWidth: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  onClick={() =>
                    !!contractProofData?.ipfsHttpLink &&
                    downloadJson(contractProofData.ipfsHttpLink)
                  }>
                  {contractProofData?.ipfsHttpLink}
                </CommandLabel>
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
                  <Link
                    target="_blank"
                    href={githubLink}
                    sx={{
                      textDecoration: "none",
                      cursor: "pointer",
                      color: "#212121",
                    }}>
                    {githubLink}
                  </Link>
                </CommandLabel>
              </Typography>
            </ListItem>
          </List>
        </Box>
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

const CommandLabel = styled(Box)({
  display: "inline-flex",
  alignItems: "center",
  height: "20px",
  padding: "0 7px",
  background: "rgba(146, 146, 146, 0.3)",
  borderRadius: "10px",
  color: "#212121",
  fontWeight: 400,
  fontSize: "14px",
  fontFamily: "IBM Plex Mono, monospace",
});

interface VerificationProofPopupProps {
  onClose: () => void;
}

export function VerificationProofPopup({ onClose }: VerificationProofPopupProps) {
  return (
    <AppPopup open={true} maxWidth={1000} hideCloseButton>
      <ClickAwayListener onClickAway={onClose}>
        <Box sx={{ width: "100%" }}>
          <Box pt={2} sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
            <IconButton sx={{ padding: 0 }} onClick={onClose}>
              <img src={close} alt="Close icon" width={15} height={15} />
            </IconButton>
          </Box>
          <CenteringBox mb={4} justifyContent="center">
            <img src={verificationPopup} alt="Popup icon" width={41} height={41} />
            <TitleText pl={2} sx={{ fontSize: 18, fontWeight: 800 }}>
              Verification Proof
            </TitleText>
          </CenteringBox>
          <ProofTable />
          <br />
          <ManualProof />
        </Box>
      </ClickAwayListener>
    </AppPopup>
  );
}
