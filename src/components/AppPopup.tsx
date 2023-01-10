import React, { ReactNode } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, styled } from "@mui/system";
import { Dialog, IconButton } from "@mui/material";

const StyledClose = styled(IconButton)(() => ({
  color: "#000",
}));

const StyledChildren = styled(Box)({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  "& .title": {
    texAlign: "center",
    fontWeight: 500,
    fontSize: 20,
    marginBottom: 20,
  },
  "& .base-button": {
    height: 40,
    marginTop: 30,
  },
});

export interface AppPopupProps {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  backgroundColor?: string;
  blur?: boolean;
  className?: string;
  maxWidth: number | string;
  hideCloseButton?: boolean;
  paddingTop?: boolean;
}

export function AppPopup({
  open,
  onClose,
  children,
  backgroundColor = "rgba(48, 48, 48, 0.4)",
  blur = true,
  className = "",
  maxWidth,
  hideCloseButton,
  paddingTop,
}: AppPopupProps) {
  return (
    <Dialog
      className={`${className} ${blur && "popup-filter"}`}
      fullWidth
      onClose={onClose}
      open={open}
      PaperProps={{
        style: {
          maxWidth: maxWidth || "unset",
          width: "100%",
          borderRadius: "10px",
          padding: 0,
          overflow: "unset",
          margin: 20,
        },
      }}
      BackdropProps={{
        style: {
          backgroundColor,
        },
      }}>
      <Box
        sx={{
          overflow: "scroll",
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}>
        {!hideCloseButton && (
          <Box sx={{ display: "flex", justifyContent: "end", width: "100%" }}>
            <StyledClose onClick={onClose}>
              <CloseRoundedIcon style={{ width: 23, height: 23 }} />
            </StyledClose>
          </Box>
        )}
        <StyledChildren px={3} pb={3} pt={paddingTop ? 3 : 0}>
          {children}
        </StyledChildren>
      </Box>
    </Dialog>
  );
}
