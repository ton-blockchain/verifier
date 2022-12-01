import { styled } from "@mui/system";
import { CenteringBox, DataBox } from "./common.styled";
import { Box, Typography } from "@mui/material";

const DataFlexibleBox = styled(DataBox)({
  minWidth: 100,
});

interface DataRowProps {
  isShrinked?: boolean;
  isExtraSmallScreen?: boolean;
}

const DataRowsBox = styled(Box)((props: DataRowProps) => ({
  display: props.isShrinked && !props.isExtraSmallScreen ? "flex" : "inherit",
  flexWrap: props.isShrinked && !props.isExtraSmallScreen ? "wrap" : "inherit",
  columnGap: props.isShrinked && !props.isExtraSmallScreen ? 30 : "",
  padding: props.isShrinked && !props.isExtraSmallScreen ? "0 30px" : "",
  "&>*:last-child": {
    borderBottom: props.isShrinked ? "" : "none !important",
  },
  "&:last-child": {
    marginBottom: 3,
  },
}));

const DataRow = styled(CenteringBox)((props: DataRowProps) => ({
  boxSizing: props.isShrinked ? "border-box" : "inherit",
  flex: props.isShrinked ? "40%" : "inherit",
  width:
    props.isShrinked && !props.isExtraSmallScreen
      ? 0
      : !props.isShrinked
      ? ""
      : props.isExtraSmallScreen
      ? "100%"
      : "",
  height: props.isShrinked ? "" : 38,
  padding: "10px 24px",
  transition: "background .15s",
  borderTop: "1px solid rgba(114, 138, 150, 0.2)",
}));

const DataRowTitle = styled(Typography)({
  fontSize: 14,
  color: "#000",
  minWidth: 110,
  fontWeight: 800,
});

const DataRowValue = styled(Typography)({
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: 14,
  color: "#728A96",
});

const IconsWrapper = styled(CenteringBox)({
  minWidth: 25,
  justifyContent: "flex-end",
});

export { DataRow, DataRowValue, DataRowTitle, DataRowsBox, DataFlexibleBox, IconsWrapper };
