import icon from "../assets/icon.svg";
import WalletConnect from "./WalletConnect";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Fade } from "@mui/material";
import github from "../assets/github.svg";
import { AddressInput } from "../components/AddressInput";
import { CenteringBox } from "./common.styled";
import { animationTimeout, githubLink } from "../const";
import {
  AppLogo,
  ContentColumn,
  GitLogo,
  LinkWrapper,
  SearchWrapper,
  TopBarContent,
  TopBarDropDown,
  TopBarWrapper,
  TopBarHeading,
} from "./topbar.styled";

export function TopBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showExpanded, setShowExpanded] = useState(pathname.length === 1);
  useEffect(() => {
    setShowExpanded(pathname.length === 1);
  }, [pathname]);

  return (
    <>
      <TopBarWrapper showexpanded={showExpanded ? 1 : 0}>
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
        <TopBarHeading>Smart Contract Verifier</TopBarHeading>
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
