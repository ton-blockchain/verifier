import { styled } from "@mui/material/styles";
import { CenteringBox, TitleText } from "./common.styled";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { BorderLessCell, HeaderCell } from "./fileTable.styled";
import { Box, Link, Typography } from "@mui/material";

const PopupTable = styled(Table)({
  overflow: "scroll",
  background: "#F7F9FB",
  borderRadius: "5px",
  width: "100%",
});

const PopupWrapper = styled(Box)({
  background: "#F7F9FB",
  borderRadius: "5px",
  width: "100%",
});

const PopupTableHead = styled(TableHead)({
  "&.MuiTableHead-root th": {
    border: "none",
    fontSize: 13,
  },
});

const PopupTableHeadRow = styled(TableRow)({
  fontWeight: 700,
});

const PopupTableHeadCell = styled(HeaderCell)({
  paddingLeft: 0,
  paddingBottom: "2px",
});

const PopupTableHeadPaddingCell = styled(BorderLessCell)({
  paddingBottom: 10,
});

const VerifiedTag = styled(CenteringBox)({
  width: 59,
  height: 21,
  background: "#08D088",
  borderRadius: 40,
  color: "#fff",
  justifyContent: "space-around",
  fontSize: 12,
});

const PopupTableBodyCell = styled(BorderLessCell)({
  paddingBottom: 16,
});

const PopupLink = styled(Link)({
  textDecoration: "none",
  cursor: "pointer",
  color: "#0088CC",
});

const CloseButtonWrapper = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
});

const PopupTableTypography = styled(Typography)({
  color: "#728A96",
  fontSize: 14,
});

const PopupTableTitle = styled(TitleText)({
  fontSize: 18,
  fontWeight: 800,
  color: "#000",
  textAlign: "center",
});

const CommandLabel = styled(Box)({
  display: "inline-flex",
  alignItems: "center",
  height: "20px",
  padding: "0 7px",
  background: "rgba(146, 146, 146, 0.3)",
  borderRadius: "10px",
  color: "#212121",
  fontWeight: 400,
  fontSize: "14px",
  fontFamily: "IBM Plex Mono, monospace",
});

const CommandEllipsisLabel = styled(CommandLabel)({
  position: "relative",
  top: 5,
  display: "inline-block",
  whiteSpace: "nowrap",
  lineHeight: "20px",
  width: "100%",
  maxWidth: 600,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export {
  PopupTable,
  PopupTableHead,
  PopupTableHeadRow,
  PopupTableHeadCell,
  PopupTableHeadPaddingCell,
  VerifiedTag,
  CommandLabel,
  CommandEllipsisLabel,
  PopupTableBodyCell,
  PopupTableTypography,
  PopupTableTitle,
  PopupWrapper,
  PopupLink,
  CloseButtonWrapper,
};
