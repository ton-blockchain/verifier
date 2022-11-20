import { styled } from "@mui/system";
import { CenteringBox, DataBox } from "./common.styled";
import { Box, Typography } from "@mui/material";

const DataFlexibleBox = styled(DataBox)({
  maxWidth: "50%",
  flex: 1,
});

interface DataRowProps {
  isShrinked?: boolean;
}

const DataRowsBox = styled(Box)((props: DataRowProps) => ({
  display: props.isShrinked ? "flex" : "inherit",
  flexWrap: props.isShrinked ? "wrap" : "inherit",
  columnGap: props.isShrinked ? 30 : "",
  padding: props.isShrinked ? "0 30px" : "",
  "&>*:last-child": {
    borderBottom: props.isShrinked ? "" : "none !important",
  },
  "&:last-child": {
    marginBottom: 20,
  },
}));

const DataRowSeparator = styled(Box)({
  width: "100%",
  height: 1,
  marginTop: 20,
  borderBottom: "1px solid rgba(114, 138, 150, 0.2)",
});

const DataRow = styled(CenteringBox)((props: DataRowProps) => ({
  boxSizing: props.isShrinked ? "border-box" : "inherit",
  flex: props.isShrinked ? "40%" : "inherit",
  width: props.isShrinked ? 0 : "",
  height: props.isShrinked ? "" : 38,
  padding: "15px 30px",
  transition: "background .15s",
  borderBottom: "1px solid rgba(114, 138, 150, 0.2)",
  "&:hover": {
    background: "rgba(114, 138, 150, 0.1)",
  },
}));

const DataRowTitle = styled(Typography)({
  fontSize: 16,
  color: "#000",
  minWidth: 120,
  fontWeight: 800,
});

const DataRowValue = styled(Typography)({
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontWeight: 16,
  color: "#728A96",
});

const IconsWrapper = styled(CenteringBox)({
  minWidth: 100,
  justifyContent: "flex-end",
});

export {
  DataRow,
  DataRowValue,
  DataRowTitle,
  DataRowsBox,
  DataFlexibleBox,
  IconsWrapper,
  DataRowSeparator,
};
