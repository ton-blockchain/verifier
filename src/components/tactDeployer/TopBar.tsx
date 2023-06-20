import icon from "../../assets/icon.svg";
import github from "../../assets/github-dark.svg";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { CenteringBox } from "../Common.styled";
import { githubLink } from "../../const";
import { TopBarContent, LinkWrapper, AppLogo, ContentColumn, GitLogo } from "../TopBar.styled";
import { styled } from "@mui/material/styles";
import { StyledTonConnectButton } from "../TopBar";

interface TopBarWrapperProps {
  isMobile: boolean;
}

const TopBarWrapper = styled(Box)(({ theme }) => (props: TopBarWrapperProps) => ({
  display: props.isMobile ? "flex" : "inherit",
  alignItems: props.isMobile ? "center" : "inherit",
  fontWight: 700,
  color: "#fff",
  height: props.isMobile ? 90 : 100,
  background: "#fff",
  borderBottomLeftRadius: theme.spacing(6),
  borderBottomRightRadius: theme.spacing(6),
  border: "0.5px solid rgba(114, 138, 150, 0.24)",
  boxShadow: "rgb(114 138 150 / 8%) 0px 2px 16px",
}));

export function TopBar() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const headerSpacings = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <TopBarWrapper px={headerSpacings ? 3.4 : 0} isMobile={isSmallScreen}>
      <TopBarContent mb={5}>
        <LinkWrapper>
          <img src={icon} width={30} height={30} alt="App icon" />
          <AppLogo>TACT DEPLOYER</AppLogo>
        </LinkWrapper>
        <ContentColumn>
          <CenteringBox mr={isSmallScreen ? 0 : 2}>
            <StyledTonConnectButton />
          </CenteringBox>
          {!isSmallScreen && (
            <LinkWrapper href={githubLink} target="_blank">
              <img src={github} alt="Github icon" width={20} height={20} />
              <GitLogo>GitHub</GitLogo>
            </LinkWrapper>
          )}
        </ContentColumn>
      </TopBarContent>
    </TopBarWrapper>
  );
}
