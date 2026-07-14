import "../App.css";
import React, { useEffect, useRef, useState } from "react";
import { Backdrop, Box, useMediaQuery, useTheme } from "@mui/material";
import { TopBar } from "../components/TopBar";
import { TestnetBar, useIsTestnet } from "../components/TestnetBar";
import { VerifierListBlock } from "../components/VerifierListBlock";
import { ContentBox, OverflowingBox } from "../components/Layout";
import { LatestVerifiedContracts } from "../components/LatestVerifiedContracts";
import { Footer } from "../components/Footer";
import { CenteringWrapper } from "../components/Footer.styled";

function HomePage() {
  const theme = useTheme();
  const headerSpacings = useMediaQuery(theme.breakpoints.down("lg"));
  const isTestnet = useIsTestnet();
  const scrollToRef = useRef();

  useEffect(() => {
    window.scrollTo({ behavior: "auto", top: scrollToRef.current?.["offsetTop"] });
  }, []);

  return (
    <Box>
      <Box ref={scrollToRef} />
      {isTestnet && <TestnetBar />}
      <TopBar />
      <ContentBox px={headerSpacings ? "20px" : 0}>
        <VerifierListBlock />
        <LatestVerifiedContracts />
      </ContentBox>
      <CenteringWrapper sx={{ bottom: 0, width: "100%" }}>
        <Footer />
      </CenteringWrapper>
    </Box>
  );
}

export default HomePage;
