import { styled } from "@mui/system";
import { CenteringBox, DataBox } from "./Common.styled";
import { Box, Typography } from "@mui/material";

const DataFlexibleBox = styled(DataBox)({
  minWidth: 100,
});

interface DataRowProps {
  isShrinked?: boolean;
  isExtraSmallScreen?: boolean;
}

const dataRowCustomProps = ["isShrinked", "isExtraSmallScreen"];

const shouldForwardDataRowProp = (prop: PropertyKey) =>
  !dataRowCustomProps.includes(prop as string);

const DataRowsBox = styled(Box, {
  shouldForwardProp: shouldForwardDataRowProp,
})<DataRowProps>(({ isShrinked, isExtraSmallScreen }) => ({
  display: isShrinked && !isExtraSmallScreen ? "flex" : "inherit",
  flexWrap: isShrinked && !isExtraSmallScreen ? "wrap" : "inherit",
  columnGap: isShrinked && !isExtraSmallScreen ? 30 : "",
  padding: isShrinked && !isExtraSmallScreen ? "0 30px" : "",
  "&>*:last-child": {
    borderBottom: isShrinked ? "" : "none !important",
  },
  "&:last-child": {
    marginBottom: 3,
  },
}));

const DataRow = styled(CenteringBox, {
  shouldForwardProp: shouldForwardDataRowProp,
})<DataRowProps>(({ isShrinked, isExtraSmallScreen }) => ({
  boxSizing: isShrinked ? "border-box" : "inherit",
  flex: isShrinked ? "40%" : "inherit",
  width:
    isShrinked && !isExtraSmallScreen ? 0 : !isShrinked ? "" : isExtraSmallScreen ? "100%" : "",
  minHeight: 38,
  padding: "10px 24px",
  transition: "background .15s",
  borderTop: "1px solid rgba(114, 138, 150, 0.2)",
}));

const DataRowTitle = styled(Typography)({
  fontSize: 14,
  color: "#000",
  minWidth: 90,
  fontWeight: 800,
});

const DataRowTitleXL = styled(Typography)({
  fontSize: 14,
  color: "#000",
  minWidth: 120,
  fontWeight: 800,
});

const DataRowValue = styled(Typography)({
  width: "100%",
  wordBreak: "break-word",
  fontSize: 14,
  color: "#728A96",
});

const IconsWrapper = styled(CenteringBox)({
  minWidth: 25,
  justifyContent: "flex-end",
});

export {
  DataRow,
  DataRowValue,
  DataRowTitleXL,
  DataRowTitle,
  DataRowsBox,
  DataFlexibleBox,
  IconsWrapper,
};
