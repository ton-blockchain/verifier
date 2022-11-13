import icon from "../assets/icon.svg";
import WalletConnect from "./WalletConnect";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Box, Fade, Link } from "@mui/material";
import headerBg from "../assets/headerBg.svg";
import github from "../assets/github.svg";
import { AddressInput } from "../components/AddressInput";
import { CenteringBox } from "./common.styled";
import { animationTimeout, contentMaxWidth, githubLink } from "../const";

const expandedHeaderHeight = 960;
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

const TopBarHeading = styled("h3")(({ theme }) => ({
  fontSize: 26,
  textAlign: "center",
  marginBottom: theme.spacing(5),
}));

const SearchWrapper = styled(CenteringBox)(() => ({
  margin: "auto",
  maxWidth: contentMaxWidth,
  width: "100%",
}));

export function TopBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showExpanded, setShowExpanded] = useState(pathname.length === 1);
  useEffect(() => {
    setShowExpanded(pathname.length === 1);
  }, [pathname]);

  return (
    <>
      <TopBarWrapper showExpanded={showExpanded}>
        <TopBarContent>
          <LinkWrapper onClick={() => navigate("/")}>
            <img src={icon} alt="App icon" />
            <AppLogo>TON VERIFY</AppLogo>
          </LinkWrapper>
          <ContentColumn>
            <CenteringBox mr={2}>
              <WalletConnect />
            </CenteringBox>
            <LinkWrapper href={githubLink} target="_blank">
              <img src={github} alt="Github icon" />
              <GitLogo>GitHub</GitLogo>
            </LinkWrapper>
          </ContentColumn>
        </TopBarContent>
        <TopBarHeading>
          <TopBarHeading>Smart Contract Verifier</TopBarHeading>
        </TopBarHeading>
        <SearchWrapper>
          <AddressInput />
        </SearchWrapper>
        <Fade in={showExpanded} timeout={animationTimeout}>
          <TopBarDropDown />
        </Fade>
      </TopBarWrapper>
    </>
  );
}
