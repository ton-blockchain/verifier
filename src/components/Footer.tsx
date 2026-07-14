import React from "react";
import {
  ContributedWrapper,
  CredentialsWrapper,
  FooterLink,
  FooterTextBoxLeft,
  FooterTextBoxRight,
  FooterWrapper,
  Separator,
  SocialsContent,
  SocialsWrapper,
} from "./Footer.styled";
import { AppLogo, LinkWrapper, RouterLinkWrapper } from "./TopBar.styled";
import { Typography, useMediaQuery } from "@mui/material";
import heart from "../assets/heart.svg";
import telegram from "../assets/telegram.svg";
import telegramHovered from "../assets/telegram-hover.svg";
import github from "../assets/github-footer.svg";
import githubHovered from "../assets/github-hover.svg";
import { HoverableIcon } from "./HoverableIcon";
import icon from "../assets/icon.svg";
import { CenteringBox } from "./Common.styled";
import { useIsTestnet, useSwitchNetwork } from "./TestnetBar";
import { useLocation } from "react-router-dom";

export const TELEGRAM_SUPPORT_LINK = "https://t.me/tonverifier";

export function Footer() {
  const isExtraSmallScreen = useMediaQuery("(max-width: 450px)");
  const switchNetwork = useSwitchNetwork();
  const isTestnet = useIsTestnet();
  const location = useLocation();
  const homeLink = {
    pathname: "/",
    search: location.search,
    hash: location.hash,
  };

  return (
    <FooterWrapper>
      <SocialsWrapper
        mb={isExtraSmallScreen ? 5 : "inherit"}
        sx={{
          flexDirection: isExtraSmallScreen ? "column" : "inherit",
          alignItems: isExtraSmallScreen ? "center" : "inherit",
        }}>
        <CenteringBox>
          <RouterLinkWrapper to={homeLink} style={{ color: "#000" }}>
            <img src={icon} alt="App icon" width={30} height={30} />
            <AppLogo>TON VERIFIER</AppLogo>
          </RouterLinkWrapper>
        </CenteringBox>
        <SocialsContent>
          <HoverableIcon
            iconUrl={telegram}
            hoveredIconUrl={telegramHovered}
            link={TELEGRAM_SUPPORT_LINK}
          />
          <HoverableIcon
            iconUrl={github}
            hoveredIconUrl={githubHovered}
            link="https://github.com/ton-studio/verifier"
          />
        </SocialsContent>
      </SocialsWrapper>
      <Separator />
      <CredentialsWrapper>
        <FooterTextBoxLeft>
          <Typography variant="body2">© 2026</Typography>
        </FooterTextBoxLeft>
        <ContributedWrapper>
          <CenteringBox sx={{ gap: 0.1 }}>
            Contributed with
            <CenteringBox mx={0.4}>
              <img src={heart} alt="Heart" width={12} height={12} />
            </CenteringBox>
            by
            <FooterLink sx={{ color: "#5E75E8" }} target="_blank" href="https://tonstudio.io/">
              TON Studio
            </FooterLink>
          </CenteringBox>
        </ContributedWrapper>
        <FooterTextBoxRight>
          <FooterLink target="_blank" href={TELEGRAM_SUPPORT_LINK}>
            <Typography variant="body2">Support</Typography>
          </FooterLink>
          {!isTestnet && (
            <Typography
              onClick={() => {
                switchNetwork();
              }}
              sx={{ ml: 2, cursor: "pointer" }}
              variant="body2">
              Switch to Testnet
            </Typography>
          )}
        </FooterTextBoxRight>
      </CredentialsWrapper>
    </FooterWrapper>
  );
}
