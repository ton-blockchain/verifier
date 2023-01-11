import { useSubmitSources } from "../lib/useSubmitSources";
import { useLoadContractInfo } from "../lib/useLoadContractInfo";
import { Box } from "@mui/system";
import { AppNotification, NotificationType } from "./AppNotification";
import { CenteringBox } from "./Common.styled";
import puzzle from "../assets/reorder-hint.svg";
import hint from "../assets/light-bulb.svg";
import like from "../assets/like.svg";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { DataRowTitle, DataRowValue } from "./DataBlock.styled";
import React from "react";
import { HintItem } from "./HintItem";

export const NotificationTitle = styled(Typography)({
  fontSize: 14,
  fontWeight: 400,
  marginBottom: "10px",
});

export const OutputTitle = styled(Typography)({
  fontSize: 14,
  fontWeight: 700,
});

export const SuccessTitle = styled(Typography)({
  fontSize: 14,
  fontWeight: 400,
});

export const ErrorRow = styled(CenteringBox)({
  padding: "20px 30px",
  paddingLeft: 0,
  "&:hover": {
    background: "transparent",
  },
});

export const ErrorRowTitle = styled(DataRowTitle)({
  minWidth: 200,
  fontSize: 14,
  fontWeight: 600,
});

export const ErrorRowSeparator = styled(Box)({
  borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
});

export const ErrorRowValue = styled(DataRowValue)({
  color: "#000",
  fontSize: 14,
  fontWeight: 400,
});

export function CompileOutput() {
  const { data: submitSourcesData, error } = useSubmitSources();
  const { data: contractInfoData } = useLoadContractInfo();

  const compileResult = submitSourcesData?.result?.compileResult;
  const hints = submitSourcesData?.hints ?? [];

  return (
    <Box my={3}>
      {["similar"].includes(compileResult?.result ?? "") && (
        <AppNotification
          singleLine
          type={NotificationType.SUCCESS}
          title={
            <CenteringBox sx={{ height: 42 }}>
              <CenteringBox mr={1}>
                <img src={like} alt="Like icon" width={31} height={31} />
              </CenteringBox>
              <SuccessTitle>
                {" "}
                <b>Great!</b> Compile output hash matches this on-chain contract
              </SuccessTitle>
            </CenteringBox>
          }
          notificationBody={<Box />}
        />
      )}

      {["not_similar"].includes(compileResult?.result ?? "") && (
        <AppNotification
          type={NotificationType.ERROR}
          title={
            <CenteringBox>
              <CenteringBox mr={1}>
                <img src={puzzle} alt="Reorder icon" width={39} height={26} />
              </CenteringBox>
              <OutputTitle>Hashes are not similar</OutputTitle>
            </CenteringBox>
          }
          notificationBody={
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <ErrorRow>
                <ErrorRowTitle>Contract hash</ErrorRowTitle>
                <ErrorRowValue>{contractInfoData?.hash ?? "-"}</ErrorRowValue>
              </ErrorRow>
              <ErrorRowSeparator />
              <ErrorRow>
                <ErrorRowTitle>Compile output hash</ErrorRowTitle>
                <ErrorRowValue>{compileResult?.hash ?? "-"}</ErrorRowValue>
              </ErrorRow>
            </Box>
          }
        />
      )}

      {compileResult?.error && (
        <AppNotification
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
                <code>{compileResult.error}</code>
              </div>
            </Box>
          }
        />
      )}

      {!!error && (
        <AppNotification
          type={NotificationType.ERROR}
          title={
            <NotificationTitle>
              <span style={{ color: "#FC5656" }}>Error: </span>
              Server error
            </NotificationTitle>
          }
          notificationBody={
            <Box sx={{ overflow: "auto", maxHeight: 300 }}>
              <div>
                <code>{error.toString()}</code>
              </div>
            </Box>
          }
        />
      )}

      {hints.length > 0 && (
        <AppNotification
          type={NotificationType.HINT}
          title={
            <CenteringBox mb={2}>
              <CenteringBox mr={1}>
                <img src={hint} alt="Light bulb icon" width={21} height={22} />
              </CenteringBox>
              <OutputTitle>Possible reasons for failure</OutputTitle>
            </CenteringBox>
          }
          notificationBody={
            <ul style={{ paddingLeft: 25 }}>
              {hints.map((hint) => (
                <HintItem key={hint} hint={hint} />
              ))}
            </ul>
          }
        />
      )}
    </Box>
  );
}
