import { usePublishProof } from "../lib/usePublishProof";
import Button from "./Button";
import { CenteringBox, DataBox, IconBox, TitleText } from "./common.styled";
import React from "react";
import publish from "../assets/publish.svg";
import verified from "../assets/verified-bold.svg";
import { CompilationNotification, NotificationType } from "./CompilationNotification";
import { Box } from "@mui/system";
import { NotificationTitle } from "./CompileOutput";
import { useSubmitSources } from "../lib/useSubmitSources";
import { SECTIONS, STEPS, usePublishStore } from "../lib/usePublishSteps";
import { Fade } from "@mui/material";
import { useFileStore } from "../lib/useFileStore";

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
          transaction. <br /> This will cost 0.5 TON
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
      text = "Your proof is ready! Click below to view it.";
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
        p="15px 30px"
        mb={1}
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
              <CompilationNotification
                type={NotificationType.NOTIFICATION}
                title={<></>}
                notificationBody={
                  <CenteringBox sx={{ overflow: "auto", maxHeight: 300 }}>
                    <NotificationTitle sx={{ marginBottom: 0 }}>{text}</NotificationTitle>
                  </CenteringBox>
                }
              />
            </Box>
            <CenteringBox mb={3} pb={3} sx={{ justifyContent: "center" }}>
              {status !== "success" && (
                <Button
                  disabled={status === "pending" || status === "issued"}
                  sx={{ width: 140, height: 44 }}
                  text="Publish"
                  onClick={() => {
                    sendTXN();
                  }}
                />
              )}
              {status === "success" && (
                <Button
                  sx={{ width: 140, height: 44 }}
                  text="View proof"
                  onClick={() => {
                    resetFiles();
                    clearTXN();
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
