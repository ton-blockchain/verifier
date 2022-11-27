import { styled } from "@mui/material/styles";
import { Box, Link } from "@mui/material";
import { animationTimeout, contentMaxWidth } from "../const";
import { CenteringBox } from "./common.styled";

const expandedHeaderHeight = 270;
const headerHeight = 200;

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
  transition: `${animationTimeout}ms`,
  transitionProperty: "height",
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
  paddingTop: theme.spacing(3),
  maxWidth: contentMaxWidth,
  width: "100%",
  justifyContent: "space-between",
  gap: 10,
}));

const AppLogo = styled("span")(() => ({
  color: "#000",
  fontSize: 20,
  fontWeight: 800,
}));
const GitLogo = styled("span")(() => ({
  fontWeight: 800,
  fontSize: 18,
}));

const TopBarHeading = styled("h3")(({ theme }) => ({
  color: "#000",
  fontSize: 26,
  textAlign: "center",
  marginBottom: theme.spacing(5),
  fontWeight: 800,
}));

const SearchWrapper = styled(CenteringBox)({
  margin: "auto",
  maxWidth: contentMaxWidth,
  width: "100%",
  marginTop: 40,
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
