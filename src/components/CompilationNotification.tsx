import React from "react";

enum NotificationType {
  ERROR = "Error",
  HINT = "Hint",
  SUCCESS = "Success",
  NOTIFICATION = "Notification",
}

interface CompilationNotificationProps {
  type: NotificationType;
}

export function CompilationNotification() {
  return <div></div>;
}
