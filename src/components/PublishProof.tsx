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
  let text = "";

  switch (status) {
    case "not_issued":
      text =
        "To store your contract’s verification proof on-chain, you will need to issue a transaction. This will cost 0.5 TON";
      break;
    case "rejected":
      text = "Transaction rejected, please retry";
      break;
    case "pending":
      text = "Check your tonhub wallet for a pending transaction";
      break;
    case "success":
      text = "Transaction issued, monitoring proof deployment on-chain";
      break;
    case "deployed":
      text = "Your proof is ready!";
      break;
    case "expired":
      text = "Transaction expired, please retry";
      break;
  }

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
              <NotificationTitle>{text}</NotificationTitle>
            </Box>
          }
        />
      </Box>
      <CenteringBox mb={3} pb={3} sx={{ justifyContent: "center" }}>
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
