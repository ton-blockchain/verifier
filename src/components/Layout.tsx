import { Box } from "@mui/material";
import { styled } from "@mui/system";

export const ContentBox = styled(Box)({
  maxWidth: 1160,
  margin: "auto",
});

interface ContractDataBoxProps {
  isMobile?: boolean;
}

export const ContractDataBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isMobile",
})<ContractDataBoxProps>(({ isMobile }) => ({
  display: isMobile ? "inherit" : "flex",
  gap: 20,
}));

export const OverflowingBox = styled(Box)({
  boxSizing: "border-box",
  maxWidth: 1160,
  width: "100%",
  marginTop: 20,
  backgroundColor: "#fff",
  borderRadius: 20,
  padding: 20,
  color: "#000",
});
