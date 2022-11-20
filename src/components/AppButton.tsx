import React, { ReactNode } from "react";
import { Button, styled } from "@mui/material";

interface StyledButtonProps {
  fontSize?: number;
  fontWeight?: number;
  transparent?: boolean;
  background?: string;
  hoverbackground?: string;
  width?: number;
  height?: number;
  textcolor?: string;
}

const StyledButton = styled(Button)((props: StyledButtonProps) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "0px 16px",
  margin: "auto",
  maxWidth: 160,
  width: props.width || "100%",
  height: props.height || "100%",
  fontSize: props.fontSize || 14,
  fontWeight: props.fontWeight || 400,
  boxShadow: "none",
  borderRadius: 40,
  border: props.transparent ? "1px solid #50A7EA" : "",
  background: props.background || "",
  whiteSpace: "nowrap",
  textTransform: "none",
  color: props.textcolor || "#000",
  "&:hover": {
    background: props.hoverbackground || "inherit",
  },
  "& img": {
    maxWidth: 22,
  },
  "&:disabled": {
    background: "#D9D9D9",
  },
}));

interface AppButtonProps extends StyledButtonProps {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export const AppButton: React.FC<AppButtonProps> = ({
  children,
  disabled,
  onClick,
  type = "button",
  fontSize = 14,
  fontWeight,
  transparent,
  background,
  hoverbackground,
  width,
  height,
  textcolor,
}) => {
  return (
    <StyledButton
      width={width}
      height={height}
      fontSize={fontSize}
      fontWeight={fontWeight}
      transparent={transparent}
      background={background}
      textcolor={textcolor ? 1 : 0}
      hoverbackground={hoverbackground}
      className={children !== "Update metadata" ? "base-button" : ""}
      type={type}
      onClick={onClick ? onClick : () => {}}
      variant={transparent ? "outlined" : "contained"}
      disabled={disabled}
      disableElevation>
      {children}
    </StyledButton>
  );
};
