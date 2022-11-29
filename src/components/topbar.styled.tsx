import { styled } from "@mui/material/styles";
import { Box, Link } from "@mui/material";
import { animationTimeout, contentMaxWidth } from "../const";
import { CenteringBox } from "./common.styled";

const expandedHeaderHeight = 250;
const headerHeight = 188;

interface TopBarWrapperProps {
  showExpanded: boolean;
}

const TopBarWrapper = styled(Box)(({ theme }) => (props: TopBarWrapperProps) => ({
  fontWight: 700,
  color: "#fff",
  width: "100%",
  minHeight: headerHeight,
  height: props.showExpanded ? expandedHeaderHeight : headerHeight,
  background: "#fff",
  borderBottomLeftRadius: theme.spacing(6),
  borderBottomRightRadius: theme.spacing(6),
  border: "0.5px solid rgba(114, 138, 150, 0.24)",
  boxShadow: "rgb(114 138 150 / 8%) 0px 2px 16px",
}));

const ContentColumn = styled(CenteringBox)(() => ({
  gap: 10,
}));

const LinkWrapper = styled(Link)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "#000",
  textDecoration: "none",
  cursor: "pointer",
}));

const TopBarContent = styled(CenteringBox)(({ theme }) => ({
  margin: "auto",
  maxWidth: contentMaxWidth,
  height: 100,
  width: "100%",
  justifyContent: "space-between",
  gap: 10,
}));

const AppLogo = styled("h4")(() => ({
  color: "#000",
  fontSize: 20,
  fontWeight: 800,
}));
const GitLogo = styled("h5")(() => ({
  color: "#000",
  fontWeight: 700,
  fontSize: 18,
}));

const TopBarHeading = styled("h3")(({ theme }) => ({
  color: "#000",
  fontSize: 26,
  marginTop: 0,
  textAlign: "center",
  fontWeight: 800,
}));

const SearchWrapper = styled(CenteringBox)({
  margin: "auto",
  maxWidth: contentMaxWidth,
  width: "100%",
});

export {
  SearchWrapper,
  LinkWrapper,
  AppLogo,
  TopBarWrapper,
  TopBarContent,
  TopBarHeading,
  GitLogo,
  ContentColumn,
};
