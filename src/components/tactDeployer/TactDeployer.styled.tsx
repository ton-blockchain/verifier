import { styled } from "@mui/material";

export const CustomValueInput = styled("input")({
  display: "flex",
  alignItems: "center",
  paddingLeft: 14,
  boxSizing: "border-box",
  height: 34,
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
