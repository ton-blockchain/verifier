import React from "react";
import {
  Box,
  CircularProgress,
  Link,
  List,
  ListItem,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CommandEllipsisLabel, CommandLabel, PopupLink } from "./VerificationProofPopup.styled";
import { downloadJson } from "../utils/jsonUtils";
import { githubLink } from "../const";
import {
  findProofByVerifierName,
  getFirstAvailableProof,
  useLoadContractProof,
} from "../lib/useLoadContractProof";
import { AppButton } from "./AppButton";
import { isOnLocalHost } from "../utils/generalUtils";
import { CenteringBox } from "./Common.styled";
import { NotificationTitle, SuccessTitle } from "./CompileOutput";
import { useInBrowserCompilation, VerificationResults } from "../lib/useInBrowserCompilation";
import { AppNotification, NotificationType } from "./AppNotification";
import like from "../assets/like.svg";
import { useLoadVerifierRegistryInfo } from "../lib/useLoadVerifierRegistryInfo";

export function ManualVerificationGuide() {
  const { data: proofs } = useLoadContractProof();
  const { data: verifierRegistry } = useLoadVerifierRegistryInfo();
  const contractProofData =
    findProofByVerifierName(proofs, verifierRegistry, "verifier.ton.org") ??
    getFirstAvailableProof(proofs);

  return (
    <List sx={{ padding: 0, marginTop: 2 }}>
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
              !!contractProofData?.ipfsHttpLink && downloadJson(contractProofData.ipfsHttpLink)
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
          <CommandLabel> docker run -i ton-contract-verifier &#60; sources.json </CommandLabel>
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
  );
}

export function InBrowserVerificationGuide() {
  const { verifyContract, isVerificationEnabled, error, loading, hash } = useInBrowserCompilation();
  const theme = useTheme();
  const notificationsSize = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box p={2}>
      <Typography sx={{ fontSize: 14, marginBottom: 2 }}>
        You are not required to rely on third-party validators. You can now verify this contract by
        yourself by having your browser download the sources and compile them locally in-browser
        using{" "}
        <Link
          sx={{ textDecoration: "none" }}
          href={"https://github.com/ton-community/func-js"}
          target="_blank">
          WASM
        </Link>
        .
        {!isOnLocalHost() && (
          <CenteringBox mt={1} sx={{ overflow: "auto", maxHeight: 300 }}>
            <NotificationTitle sx={{ margin: 0 }}>
              The web page you're looking at is{" "}
              <Link
                sx={{ textDecoration: "none" }}
                href="https://github.com/ton-community/contract-verifier"
                target="_blank">
                open source
              </Link>
              , you can also fork or run it locally if you wish to have absolute control.
            </NotificationTitle>
          </CenteringBox>
        )}
      </Typography>
      {isVerificationEnabled() !== VerificationResults.VALID ? (
        <Tooltip
          arrow
          title={<Typography sx={{ fontSize: 13 }}>{isVerificationEnabled()}</Typography>}
          placement="top">
          <Box sx={{ width: 144, margin: "auto" }}>
            <AppButton
              onClick={() => verifyContract()}
              disabled={isVerificationEnabled() !== VerificationResults.VALID || loading || !!hash}
              fontSize={14}
              fontWeight={800}
              textColor="#fff"
              height={44}
              width={144}
              background="#1976d2"
              hoverBackground="#156cc2">
              Verify locally
            </AppButton>
          </Box>
        </Tooltip>
      ) : (
        <AppButton
          onClick={() => verifyContract()}
          disabled={isVerificationEnabled() !== VerificationResults.VALID || loading || !!hash}
          fontSize={14}
          fontWeight={800}
          textColor="#fff"
          height={44}
          width={144}
          background="#1976d2"
          hoverBackground="#156cc2">
          {loading && (
            <CircularProgress
              sx={{
                color: "#fff",
                height: "20px !important",
                width: "20px !important",
              }}
            />
          )}
          Verify locally
        </AppButton>
      )}
      {error && (
        <>
          <AppNotification
            noBottomMargin
            type={NotificationType.ERROR}
            title={
              <NotificationTitle>
                <span style={{ color: "#FC5656" }}>Error: </span>
                Compile error
              </NotificationTitle>
            }
            notificationBody={
              <Box sx={{ overflow: "auto", maxHeight: 300 }}>
                <div>
                  <code>{error}</code>
                </div>
              </Box>
            }
          />
          <Typography sx={{ marginTop: 1, fontSize: 13 }}>
            You can ask for help in our{" "}
            <Link
              sx={{
                textDecoration: "none",
                cursor: "pointer",
                color: "#0088CC",
              }}
              href="https://t.me/tonverifier"
              target="_blank">
              Telegram support group
            </Link>
          </Typography>
        </>
      )}
      {!!hash && (
        <AppNotification
          noBottomMargin
          singleLine={!notificationsSize}
          type={NotificationType.SUCCESS}
          title={
            <CenteringBox sx={{ height: 42 }}>
              <CenteringBox mr={1}>
                <img src={like} alt="Like icon" width={31} height={31} />
              </CenteringBox>
              <SuccessTitle>
                {" "}
                <b>Great!</b> In-browser compiler output hash matches this on-chain contract
              </SuccessTitle>
            </CenteringBox>
          }
          notificationBody={<Box />}
        />
      )}
    </Box>
  );
}
