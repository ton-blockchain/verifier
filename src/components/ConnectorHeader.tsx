import React from "react";
import { Box, IconButton, styled, Typography, useTheme } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const StyledContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "relative",
  paddingBottom: 10,
  marginBottom: 20,
  width: "100%",
  "& h4": {
    fontSize: 18,
    fontWeight: 400,
  },
});

const StyledSeparator = styled(Box)(({ theme }) => ({
  position: "absolute",
  left: 0,
  bottom: 0,
  width: "100%",
  height: 1,
  background: theme.palette.text.primary,
  opacity: 0.2,
}));

interface ConnectorHeaderProps {
  title: string;
  onClose?: () => void;
}

export function ConnectorHeader({ title, onClose }: ConnectorHeaderProps) {
  const theme = useTheme();

  return (
    <StyledContainer>
      <Typography variant="h4">{title}</Typography>
      {onClose && (
        <IconButton onClick={onClose} sx={{ padding: 0 }}>
          <CloseRoundedIcon style={{ color: theme.palette.text.primary }} />
        </IconButton>
      )}
      <StyledSeparator />
    </StyledContainer>
  );
}
