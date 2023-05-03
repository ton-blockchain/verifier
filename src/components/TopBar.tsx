import icon from "../assets/icon.svg";
import { WalletConnect } from "./WalletConnect";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import github from "../assets/github-dark.svg";
import { AddressInput } from "../components/AddressInput";
import { CenteringBox } from "./Common.styled";
import { githubLink } from "../const";
import {
  AppLogo,
  ContentColumn,
  GitLogo,
  LinkWrapper,
  SearchWrapper,
  TopBarContent,
  TopBarHeading,
  TopBarWrapper,
} from "./TopBar.styled";
import { IconButton, useMediaQuery, useTheme } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { MobileMenu } from "./MobileMenu";
import { useNavigatePreserveQuery } from "../lib/useNavigatePreserveQuery";

export function TopBar() {
  const { pathname } = useLocation();
  const theme = useTheme();
  const navigate = useNavigatePreserveQuery();
  const headerSpacings = useMediaQuery(theme.breakpoints.down("lg"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [showExpanded, setShowExpanded] = useState(pathname.length === 1);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setShowExpanded(pathname.length === 1);
  }, [pathname]);

  return (
    <TopBarWrapper
      px={headerSpacings ? 2.4 : 0}
      isMobile={isSmallScreen}
      showExpanded={showExpanded}>
      {isSmallScreen && (
        <IconButton
          sx={{ width: 35, height: 35, marginRight: 2.4 }}
          onClick={() => setShowMenu(true)}>
          <MenuRoundedIcon sx={{ width: 35, height: 35 }} />
        </IconButton>
      )}
      {!isSmallScreen && (
        <TopBarContent mb={5}>
          <LinkWrapper onClick={() => navigate("/")}>
            <img src={icon} width={30} height={30} alt="App icon" />
            <AppLogo>TON VERIFIER</AppLogo>
          </LinkWrapper>
          <ContentColumn>
            <CenteringBox mr={2}>
              <WalletConnect />
            </CenteringBox>
            <LinkWrapper href={githubLink} target="_blank">
              <img src={github} alt="Github icon" width={20} height={20} />
              <GitLogo>GitHub</GitLogo>
            </LinkWrapper>
          </ContentColumn>
        </TopBarContent>
      )}
      {pathname.length < 2 && !isSmallScreen && (
        <TopBarHeading>Smart Contract Verifier</TopBarHeading>
      )}
      <SearchWrapper>
        <AddressInput />
      </SearchWrapper>
      <MobileMenu closeMenu={() => setShowMenu(false)} showMenu={showMenu} />
    </TopBarWrapper>
  );
}
