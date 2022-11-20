import { styled } from "@mui/system";
import { CenteringBox, DataBox } from "./common.styled";
import { Box, Typography } from "@mui/material";

const DataFlexibleBox = styled(DataBox)({
  maxWidth: "50%",
  flex: 1,
});

interface DataRowProps {
  isshrinked?: boolean;
}

const DataRowsBox = styled(Box)((props: DataRowProps) => ({
  display: props.isshrinked ? "flex" : "inherit",
  flexWrap: props.isshrinked ? "wrap" : "inherit",
  columnGap: props.isshrinked ? 30 : "",
  padding: props.isshrinked ? "0 30px" : "",
  "&>*:last-child": {
    borderBottom: props.isshrinked ? "" : "none !important",
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
  boxSizing: props.isshrinked ? "border-box" : "inherit",
  flex: props.isshrinked ? "40%" : "inherit",
  width: props.isshrinked ? 0 : "",
  height: props.isshrinked ? "" : 38,
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
