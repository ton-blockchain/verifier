import { styled } from "@mui/system";
import { FormControl, FormLabel, Select } from "@mui/material";

const CompilerFormControl = styled(FormControl)(({ theme }) => ({
  flexGrow: 1,
}));

const CompilerSelect = styled(Select)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  height: theme.spacing(5.3),
  minWidth: 150,
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
  borderRadius: theme.spacing(1.5),
  border: "1px solid lightgray",
  padding: "0 40px 0 120px",
  color: "#728A96",
  background: "transparent",
  fontFamily: "Mulish",
}));

export { DirectoryInput, CompilerLabel, CompilerSelect, CompilerFormControl };
