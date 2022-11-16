import { styled } from "@mui/system";
import { CenteringBox, DataBox } from "./common.styled";
import { Box, Typography } from "@mui/material";

const DataFlexibleBox = styled(DataBox)({
  maxWidth: "50%",
  flex: 1,
});

const DataRowsBox = styled(Box)({
  "&>*:not(:last-child)": {
    borderBottom: "1px solid rgba(114, 138, 150, 0.2)",
  },
  "&:last-child": {
    marginBottom: 20,
  },
});

const DataRow = styled(CenteringBox)({
  height: 38,
  padding: "15px 30px",
  transition: "background .15s",
  "&:hover": {
    background: "rgba(114, 138, 150, 0.1)",
  },
});

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

export { DataRow, DataRowValue, DataRowTitle, DataRowsBox, DataFlexibleBox, IconsWrapper };
