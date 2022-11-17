import { usePublishProof } from "../lib/usePublishProof";
import Button from "./Button";
import { CenteringBox, DataBox, IconBox, TitleBox, TitleText } from "./common.styled";
import React from "react";
import publish from "../assets/publish.svg";
import { CompilationNotification, NotificationType } from "./CompilationNotification";
import { Box } from "@mui/system";
import { NotificationTitle } from "./CompileOutput";

export function PublishProof() {
  const { mutate, status } = usePublishProof();

  return (
    <DataBox mb={3}>
      <TitleBox mb={1}>
        <IconBox>
          <img src={publish} alt="publish icon" width={41} height={41} />
        </IconBox>
        <TitleText>Publish proof</TitleText>
      </TitleBox>
      <Box sx={{ padding: "0 30px" }}>
        <CompilationNotification
          type={NotificationType.NOTIFICATION}
          title={<></>}
          notificationBody={
            <Box sx={{ overflow: "auto", maxHeight: 300 }}>
              {status === "not_issued" && (
                <NotificationTitle>
                  To store your contract’s verification proof on-chain, you will need to issue a
                  transaction.
                </NotificationTitle>
              )}
              {status === "not_issued" && (
                <NotificationTitle sx={{ fontWeight: 700 }}>
                  This will cost 0.5 TON
                </NotificationTitle>
              )}
              {status === "pending" && (
                <NotificationTitle>
                  Check your tonhub wallet for a pending transaction`
                </NotificationTitle>
              )}
              {status === "rejected" && (
                <NotificationTitle>Transaction rejected, please retry</NotificationTitle>
              )}
              {status === "expired" && (
                <NotificationTitle>Transaction expired, please retry</NotificationTitle>
              )}
              {status === "success" && (
                <NotificationTitle>
                  Transaction issued, monitoring proof deployment on-chain
                </NotificationTitle>
              )}
              {status === "deployed" && <NotificationTitle>Your proof is ready!</NotificationTitle>}
            </Box>
          }
        />
      </Box>
      <CenteringBox sx={{ justifyContent: "center" }}>
        <Button
          sx={{ width: 140, height: 44 }}
          text="Publish proof"
          onClick={() => {
            mutate();
          }}
        />
      </CenteringBox>
    </DataBox>
  );
}
