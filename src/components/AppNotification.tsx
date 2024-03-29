import React from "react";
import { Box, styled } from "@mui/system";

export enum NotificationType {
  ERROR = "Error",
  HINT = "Hint",
  SUCCESS = "Success",
  INFO = "Info",
}

interface NotificationBoxProps {
  borderColor?: string;
  backgroundColor?: string;
  singleLine?: boolean;
  noBottomMargin?: boolean;
  noTopMargin?: boolean;
}

const NotificationBox = styled(Box)((props: NotificationBoxProps) => ({
  padding: `${props.singleLine ? 0 : 15}px 25px`,
  marginBottom: props.noBottomMargin ? 0 : 24,
  marginTop: props.noTopMargin ? 0 : 24,
  background: props.backgroundColor || "",
  border: `1px solid ${props.borderColor || "#D8D8D8"}`,
  borderRadius: 12,
}));

interface CompilationNotificationProps {
  type: NotificationType;
  title: React.ReactNode;
  notificationBody: React.ReactNode;
  singleLine?: boolean;
  noBottomMargin?: boolean;
  noTopMargin?: boolean;
  noMargin?: boolean;
}

export function AppNotification({
  title,
  type,
  notificationBody,
  singleLine,
  noBottomMargin,
  noTopMargin,
}: CompilationNotificationProps) {
  let borderColor;
  let backgroundColor;

  switch (type) {
    case NotificationType.INFO:
      backgroundColor = "rgba(216, 216, 216, 0.2);";
      break;
    case NotificationType.ERROR:
      borderColor = "rgba(252, 86, 86, 0.42);";
      backgroundColor = "rgba(252, 86, 86, 0.08);";
      break;
    case NotificationType.HINT:
      backgroundColor = "rgba(94, 117, 232, 0.1);";
      break;
    case NotificationType.SUCCESS:
      backgroundColor = "#D6FFCE";
      break;
  }

  return (
    <NotificationBox
      singleLine={singleLine}
      borderColor={borderColor}
      backgroundColor={backgroundColor}
      noBottomMargin={noBottomMargin}
      noTopMargin={noTopMargin}>
      {title}
      {notificationBody}
    </NotificationBox>
  );
}
