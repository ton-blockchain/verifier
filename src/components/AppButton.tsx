import React, { ReactNode } from "react";
import { Button, styled } from "@mui/material";

interface StyledButtonProps {
  fontSize?: number;
  fontWeight?: number;
  transparent?: boolean;
  background?: string;
  hoverBackground?: string;
  width?: number | string;
  height?: number | string;
  textColor?: string;
}

const customButtonProps = [
  "fontSize",
  "fontWeight",
  "transparent",
  "background",
  "hoverBackground",
  "width",
  "height",
  "textColor",
];

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => !customButtonProps.includes(prop as string),
})<StyledButtonProps>(
  ({
    theme,
    width,
    height,
    fontSize = 14,
    fontWeight = 400,
    transparent,
    background,
    hoverBackground,
    textColor,
  }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "0px 16px",
    margin: "auto",
    maxWidth: 160,
    width: width || "100%",
    height: height || "100%",
    fontSize,
    fontWeight,
    boxShadow: "none",
    borderRadius: 40,
    border: transparent ? "1px solid #50A7EA" : "",
    background: background || "inherit",
    whiteSpace: "nowrap",
    textTransform: "none",
    color: textColor || "#000",
    "&:hover": {
      background: hoverBackground || "inherit",
    },
    "& img": {
      maxWidth: 22,
    },
    "&:disabled": {
      background: "#D9D9D9",
    },
    [theme.breakpoints.down(900)]: {
      padding: 0,
      minWidth: 25,
    },
  }),
);

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
  hoverBackground,
  width,
  height,
  textColor,
}) => {
  return (
    <StyledButton
      width={width}
      height={height}
      fontSize={fontSize}
      fontWeight={fontWeight}
      transparent={transparent}
      background={background}
      textColor={textColor}
      hoverBackground={hoverBackground}
      className="base-button"
      type={type}
      onClick={onClick ? onClick : () => {}}
      variant={transparent ? "outlined" : "contained"}
      disabled={disabled}
      disableElevation>
      {children}
    </StyledButton>
  );
};
