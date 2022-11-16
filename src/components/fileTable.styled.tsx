import { styled } from "@mui/system";
import TableCell from "@mui/material/TableCell";

const DirectoryBox = styled("input")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: 300,
  height: 44,
  background: "#FFFFFF",
  border: "1px solid #D8D8D8",
  borderRadius: "12px",
  fontSize: 14,
  fontFamily: "Mulish",
  paddingLeft: 10,
}));

const BorderLessCell = styled(TableCell)(({ theme }) => ({
  border: "none",
  padding: 0,
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 700,
}));

const HR = styled("hr")(({ theme }) => ({
  display: "block",
  width: "100%",
  height: 1,
  backgroundColor: "#ccc",
  border: "none",
}));

export { DirectoryBox, HR, HeaderCell, BorderLessCell };
