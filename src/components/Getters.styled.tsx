import { Box, styled, TableCell, Typography } from "@mui/material";

export const TitleText = styled(Typography)({
  fontSize: 14,
  fontWeight: 700,
});

export const TitleSubtext = styled(Typography)({
  fontSize: 12,
  color: "#949597",
});

export const GetterBox = styled(Box)({
  border: "1px solid #D9D9D988",
  overflow: "hidden",
  borderRadius: 14,
  width: "100%",
  paddingBottom: 6,
});

export const FlexBoxColumn = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

export const FlexBoxRow = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

export const TitleBox = styled(FlexBoxRow)({
  background: "#F7F9FB",
  padding: "14px 20px",
});

export const ContentBox = styled(FlexBoxColumn)({
  fontSize: 14,
});

export const TableCellStyled = styled(TableCell)({
  padding: "10px 6px",
  borderBottom: 0,
});

export const TypeChip = styled(Box)({
  border: "1px solid #D8D8D8",
  background: "white",
  borderRadius: 6,
  padding: "0px 10px",
  fontSize: 12,
  textAlign: "center",
  display: "inline-block",
});

export const ValueBox = styled(Box)({
  borderRadius: 10,
  padding: "10px 14px",
  whiteSpace: "break-spaces",
  wordBreak: "break-all",
  "&:hover": {
    background: "#f8f8f8",
  },
});

export const ParameterInput = styled("input")({
  display: "flex",
  alignItems: "center",
  paddingLeft: 10,
  width: "100%",
  boxSizing: "border-box",
  height: 40,
  background: "#FFFFFF",
  border: "1px solid #D8D8D8",
  borderRadius: "12px",
  fontSize: 14,
  fontFamily: "Mulish",
  outline: "none",
  "&:hover": {
    border: "1px solid #b0b0b0",
  },
  "&:focus": {
    border: "1px solid #807e7e",
  },
});
