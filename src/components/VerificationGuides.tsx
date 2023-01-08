import React, { useEffect, useState } from "react";
import { Box, Link, List, ListItem, Typography } from "@mui/material";
import { CommandEllipsisLabel, CommandLabel, PopupLink } from "./VerificationProofPopup.styled";
import { downloadJson } from "../utils/jsonUtils";
import { githubLink } from "../const";
import { useLoadContractProof } from "../lib/useLoadContractProof";
import { AppButton } from "./AppButton";
import {
  isOnLocalHost,
  isWebAssemblySupported,
  verifyCompilerVersion,
} from "../utils/generalUtils";
import { AppNotification, NotificationType } from "./AppNotification";
import { CenteringBox } from "./Common.styled";
import { NotificationTitle } from "./CompileOutput";

export function ManualVerificationGuide() {
  const { data: contractProofData } = useLoadContractProof();

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
  const [isVerificationEnabled, setIsVerificationEnabled] = useState(true);
  const { data: contractProofData } = useLoadContractProof();

  useEffect(() => {
    !isWebAssemblySupported() && setIsVerificationEnabled(false);
    !isOnLocalHost() && setIsVerificationEnabled(false);
    !verifyCompilerVersion() && setIsVerificationEnabled(false);
    contractProofData.compiler !== "func" && setIsVerificationEnabled(false);
  }, []);

  return (
    <Box sx={{ height: "117px", overflowY: "scroll" }} p={2}>
      <Box sx={{ height: "100%" }}>
        <Typography sx={{ fontSize: 14 }}>
          You can verify this contract by compiling the contract with a wasm binding of the{" "}
          <Link
            sx={{ textDecoration: "none" }}
            href={"https://github.com/ton-community/func-js"}
            target="_blank">
            compiler
          </Link>
          {window.location.hostname === "localhost" && (
            <Box>
              <AppNotification
                type={NotificationType.INFO}
                title={<></>}
                notificationBody={
                  <CenteringBox sx={{ overflow: "auto", maxHeight: 300 }}>
                    <NotificationTitle sx={{ margin: 0 }}>
                      For maximum safety, fork this{" "}
                      <Link
                        sx={{ textDecoration: "none" }}
                        href="https://github.com/ton-community/ton-contract-verifier"
                        target="_blank">
                        project{" "}
                      </Link>
                      and run it locally
                    </NotificationTitle>
                  </CenteringBox>
                }
              />
            </Box>
          )}
        </Typography>
        <AppButton
          disabled={!isVerificationEnabled}
          fontSize={14}
          fontWeight={800}
          textColor="#fff"
          height={44}
          width={144}
          background="#1976d2"
          hoverBackground="#156cc2">
          Verify in Browser
        </AppButton>
      </Box>
    </Box>
  );
}
