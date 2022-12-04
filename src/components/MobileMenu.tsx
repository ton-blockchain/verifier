import React from "react";
import { Drawer, IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box } from "@mui/system";
import { WalletConnect } from "./WalletConnect";
import { githubLink } from "../const";
import github from "../assets/github-dark.svg";
import { AppLogo, GitLogo, LinkWrapper } from "./TopBar.styled";
import icon from "../assets/icon.svg";
import { useNavigate } from "react-router-dom";

interface MobileMenuProps {
  closeMenu?: () => void;
  showMenu?: boolean;
}

export function MobileMenu({ closeMenu, showMenu }: MobileMenuProps) {
  const navigate = useNavigate();

  return (
    <Drawer anchor="left" open={showMenu} onClose={closeMenu}>
      <Box
        p={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "250px",
          height: "100%",
        }}>
        <IconButton sx={{ alignSelf: "end", padding: 0.3 }} onClick={closeMenu}>
          <CloseRoundedIcon style={{ width: 25, height: 25 }} />
        </IconButton>
        <Box
          pt={2}
          sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box sx={{ width: "150px" }}>
            <WalletConnect />
          </Box>
          <LinkWrapper href={githubLink} target="_blank">
            <img src={github} alt="Github icon" width={20} height={20} />
            <GitLogo>GitHub</GitLogo>
          </LinkWrapper>
        </Box>
        <LinkWrapper onClick={() => navigate("/")}>
          <img src={icon} width={30} height={30} alt="App icon" />
          <AppLogo>
            TON VERIFIER <span style={{ fontWeight: 700, fontSize: 14 }}>Beta</span>
          </AppLogo>
        </LinkWrapper>
      </Box>
    </Drawer>
  );
}
