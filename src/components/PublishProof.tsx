import { usePublishProof } from "../lib/usePublishProof";
import Button from "./Button";
import { CenteringBox, DataBox, IconBox, TitleText } from "./common.styled";
import React from "react";
import publish from "../assets/publish.svg";
import verified from "../assets/verified-bold.svg";
import { AppNotification, NotificationType } from "./AppNotification";
import { Box } from "@mui/system";
import { NotificationTitle } from "./CompileOutput";
import { useSubmitSources } from "../lib/useSubmitSources";
import { SECTIONS, STEPS, usePublishStore } from "../lib/usePublishSteps";
import { CircularProgress, Fade } from "@mui/material";
import { useFileStore } from "../lib/useFileStore";
import { AppButton } from "./AppButton";

export function PublishProof() {
  const { data } = useSubmitSources();
  const { sendTXN, status, clearTXN } = usePublishProof();
  const { step, toggleSection, currentSection } = usePublishStore();
  const { reset: resetFiles } = useFileStore();

  const canPublish = !!data?.result?.msgCell;

  let text: React.ReactNode;

  const onSectionExpand = () =>
    step === STEPS.PUBLISH && canPublish && toggleSection(SECTIONS.PUBLISH);

  switch (status) {
    case "initial":
      text = (
        <span>
          To store your contract’s verification proof on-chain, you will need to issue a
          transaction. This will cost 0.5 TON
        </span>
      );
      break;
    case "rejected":
      text = "Transaction rejected, please retry.";
      break;
    case "pending":
      text = "Check your tonhub wallet for a pending transaction.";
      break;
    case "issued":
      text = "Transaction issued, monitoring proof deployment on-chain.";
      break;
    case "success":
      text = "Your contract is now verified! Click below to view it.";
      break;
    case "expired":
      text = "Transaction expired, please retry.";
      break;
    case "error":
      text =
        "The transaction is taking too long to complete or have failed. Please use a blockchain explorer to monitor it. You can also use our telegram support group.";
  }

  return (
    <DataBox mb={6}>
      <CenteringBox
        p={currentSection === SECTIONS.PUBLISH ? "30px 24px 0 24px" : "20px 24px"}
        onClick={onSectionExpand}
        sx={{
          opacity: step === STEPS.PUBLISH && canPublish ? 1 : 0.25,
          cursor: step === STEPS.PUBLISH && canPublish ? "pointer" : "inherit",
        }}>
        <IconBox>
          <img
            src={status === "success" ? verified : publish}
            alt="publish icon"
            width={41}
            height={41}
          />
        </IconBox>
        <TitleText>Publish</TitleText>
      </CenteringBox>
      {currentSection === SECTIONS.PUBLISH && canPublish && (
        <Fade in={currentSection === SECTIONS.PUBLISH}>
          <Box>
            <Box sx={{ padding: "0 30px" }}>
              <AppNotification
                type={NotificationType.INFO}
                title={<></>}
                notificationBody={
                  <CenteringBox sx={{ overflow: "auto", maxHeight: 300 }}>
                    <NotificationTitle sx={{ marginBottom: 0 }}>{text}</NotificationTitle>
                  </CenteringBox>
                }
              />
            </Box>
            <CenteringBox mb={3} sx={{ justifyContent: "center" }}>
              {status !== "success" && (
                <AppButton
                  disabled={status === "pending" || status === "issued"}
                  fontSize={14}
                  fontWeight={800}
                  textColor="#fff"
                  height={44}
                  width={144}
                  background="#1976d2"
                  hoverBackground="#156cc2"
                  onClick={() => {
                    sendTXN();
                  }}>
                  {(status === "pending" || status === "issued") && (
                    <CircularProgress
                      sx={{ color: "#fff", height: "20px !important", width: "20px !important" }}
                    />
                  )}
                  Publish
                </AppButton>
              )}
              {status === "success" && (
                <Button
                  sx={{ height: 44 }}
                  text="View verified contract"
                  onClick={() => {
                    location.reload();
                  }}
                />
              )}
            </CenteringBox>
          </Box>
        </Fade>
      )}
    </DataBox>
  );
}
