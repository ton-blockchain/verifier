import { styled } from "@mui/material/styles";
import { Box, Link } from "@mui/material";
import { animationTimeout, contentMaxWidth } from "../const";
import headerBg from "../assets/headerBg.svg";
import { CenteringBox } from "./common.styled";

const expandedHeaderHeight = "60vh";
const headerHeight = 360;

interface TopBarWrapperProps {
  showExpanded: boolean;
}

const TopBarWrapper = styled(Box)(({ theme }) => (props: TopBarWrapperProps) => ({
  fontWight: 700,
  color: "#fff",
  width: "100%",
  minHeight: headerHeight,
  height: props.showExpanded ? expandedHeaderHeight : headerHeight,
  background: "#232328",
  borderBottomLeftRadius: theme.spacing(6),
  borderBottomRightRadius: theme.spacing(6),
  transition: `${animationTimeout}ms`,
  transitionProperty: "height",
}));

const TopBarDropDown = styled(Box)(({ theme }) => ({
  width: "100%",
  minHeight: 360,
  height: expandedHeaderHeight,
  background: `#232328 url(${headerBg}) no-repeat center center`,
  backgroundSize: "contain",
  borderBottomLeftRadius: theme.spacing(6),
  borderBottomRightRadius: theme.spacing(6),
}));

const ContentColumn = styled(CenteringBox)(() => ({
  gap: 10,
}));

const LinkWrapper = styled(Link)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "#fff",
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
  fontSize: 20,
  fontWeight: 800,
}));
const GitLogo = styled("span")(() => ({
  fontWeight: 800,
  fontSize: 18,
}));

interface Props {
  isHeadingDisplayed?: boolean;
}

const TopBarHeading = styled("h3")(({ theme }) => ({
  fontSize: 26,
  textAlign: "center",
  marginBottom: theme.spacing(5),
  fontWeight: 800,
}));

const SearchWrapper = styled(CenteringBox)((props: Props) => ({
  margin: "auto",
  maxWidth: contentMaxWidth,
  width: "100%",
  marginTop: props.isHeadingDisplayed ? 0 : 40,
}));

export {
  SearchWrapper,
  LinkWrapper,
  AppLogo,
  TopBarWrapper,
  TopBarContent,
  TopBarHeading,
  GitLogo,
  TopBarDropDown,
  ContentColumn,
};
