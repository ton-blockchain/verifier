import icon from "../assets/icon.svg";
import { WalletConnect } from "./WalletConnect";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import github from "../assets/github-dark.svg";
import { AddressInput } from "../components/AddressInput";
import { CenteringBox } from "./common.styled";
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
      <TopBarWrapper showExpanded={showExpanded}>
        <TopBarContent mb={5}>
          <LinkWrapper onClick={() => navigate("/")}>
            <img src={icon} alt="App icon" />
            <AppLogo>TON VERIFIER</AppLogo>
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
        {pathname.length < 2 && <TopBarHeading>Smart Contract Verifier</TopBarHeading>}
        <SearchWrapper>
          <AddressInput />
        </SearchWrapper>
      </TopBarWrapper>
    </>
  );
}
