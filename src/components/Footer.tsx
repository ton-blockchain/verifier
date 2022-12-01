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
} from "./footer.styled";
import { AppLogo, LinkWrapper } from "./topbar.styled";
import { Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import heart from "../assets/heart.svg";
import telegram from "../assets/telegram.svg";
import telegramHovered from "../assets/telegram-hover.svg";
import github from "../assets/github-footer.svg";
import githubHovered from "../assets/github-hover.svg";
import { HoverableIcon } from "./HoverableIcon";
import icon from "../assets/icon.svg";
import { useNavigate } from "react-router-dom";

export const TELEGRAM_SUPPORT_LINK = "https://t.me/tonverifier";

export function Footer() {
  const isExtraSmallScreen = useMediaQuery("(max-width: 450px)");
  const navigate = useNavigate();

  return (
    <FooterWrapper>
      <SocialsWrapper
        mb={isExtraSmallScreen ? 3 : "inherit"}
        sx={{
          flexDirection: isExtraSmallScreen ? "column" : "inherit",
          alignItems: isExtraSmallScreen ? "center" : "inherit",
        }}>
        <Box>
          <LinkWrapper sx={{ color: "#000" }} onClick={() => navigate("/")}>
            <img src={icon} alt="App icon" />
            <AppLogo>
              TON VERIFIER <span style={{ fontWeight: 700, fontSize: 14 }}>Beta</span>
            </AppLogo>
          </LinkWrapper>
        </Box>
        <SocialsContent>
          <HoverableIcon
            iconUrl={telegram}
            hoveredIconUrl={telegramHovered}
            link={TELEGRAM_SUPPORT_LINK}
          />
          <HoverableIcon
            iconUrl={github}
            hoveredIconUrl={githubHovered}
            link="https://github.com/orbs-network/ton-contract-verifier"
          />
        </SocialsContent>
      </SocialsWrapper>
      <Separator />
      <CredentialsWrapper>
        <FooterTextBoxLeft>
          <Typography variant="body2">© 2022 Orbs.com</Typography>
        </FooterTextBoxLeft>
        <ContributedWrapper>
          <Typography variant="body2">
            Contributed with {` `}
            <img src={heart} alt="Orbs logo" width={9} height={7} />
            {` `} by {` `}
            <FooterLink sx={{ color: "#CF84D1" }} target="_blank" href="https://orbs.com/">
              Orbs
            </FooterLink>
          </Typography>
        </ContributedWrapper>
        <FooterTextBoxRight>
          <FooterLink target="_blank" href={TELEGRAM_SUPPORT_LINK}>
            <Typography variant="body2">Support</Typography>
          </FooterLink>
        </FooterTextBoxRight>
      </CredentialsWrapper>
    </FooterWrapper>
  );
}
