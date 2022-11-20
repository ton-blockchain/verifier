import { styled } from "@mui/system";
import { FormControl, FormLabel, Select } from "@mui/material";

const CompilerFormControl = styled(FormControl)({
  flexGrow: 1,
});

const CompilerSelect = styled(Select)(({ theme }) => ({
  borderRadius: theme.spacing(1.2),
  height: theme.spacing(5.3),
  minWidth: 150,
  ".MuiOutlinedInput-notchedOutline": {
    border: "1px solid #D8D8D8",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #807e7e",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #b0b0b0",
  },
}));

const CompilerLabel = styled(FormLabel)(({ theme }) => ({
  color: "#000",
  fontSize: 12,
  marginLeft: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const DirectoryInput = styled("input")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  boxSizing: "border-box",
  width: "100%",
  flex: 2,
  height: theme.spacing(5.3),
  borderRadius: theme.spacing(1.2),
  border: "1px solid #D8D8D8",
  outline: "none",
  padding: "0 40px 0 125px",
  color: "#000",
  background: "transparent",
  fontFamily: "Mulish",
  fontSize: 14,
  "&:hover": {
    border: "1px solid #b0b0b0",
  },
  "&:focus": {
    border: "1px solid #807e7e",
  },
}));

export { DirectoryInput, CompilerLabel, CompilerSelect, CompilerFormControl };
