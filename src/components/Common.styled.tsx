import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

const CenteringBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

const DataBox = styled(Box)({
  boxSizing: "border-box",
  maxWidth: 1160,
  width: "100%",
  marginTop: 20,
  backgroundColor: "#fff",
  borderRadius: 20,
  color: "#000",
  border: "0.5px solid rgba(114, 138, 150, 0.24)",
  boxShadow: "rgb(114 138 150 / 8%) 0px 2px 16px",
});

const TitleBox = styled(CenteringBox)({
  padding: "30px 24px 0 24px",
});

const IconBox = styled(CenteringBox)({
  marginRight: 8,
});

const TitleText = styled(Typography)({
  fontSize: 20,
  color: "#161C28",
  fontWeight: 800,
});

export { CenteringBox, DataBox, TitleBox, TitleText, IconBox };
