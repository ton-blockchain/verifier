import React from "react";
import { styled } from "@mui/system";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import alert from "../assets/verification-alert.svg";
import binary from "../assets/verification-binary.svg";
import bomb from "../assets/verification-bomb.svg";
import paper from "../assets/verification-paper.svg";
import show from "../assets/show.svg";
import verification from "../assets/verification.svg";
import { CenteringWrapper } from "./Footer.styled";
import { CenteringBox, DataBox, IconBox, TitleBox, TitleText } from "./Common.styled";
import { AppButton } from "./AppButton";
import { VerificationProofPopup } from "./VerificationProofPopup";
import { useSearchParams } from "react-router-dom";

interface VerificationRulesProps {
  makeFlexible?: boolean;
  isMobile: boolean;
}

const VerificationRules = styled(CenteringBox)(({ theme }) => (props: VerificationRulesProps) => ({
  flexWrap: props.makeFlexible ? "wrap" : "inherit",
  gap: props.makeFlexible ? 20 : "inherit",
  justifyContent: props.makeFlexible ? "center" : "space-between",
  padding: 24,
  [theme.breakpoints.down("lg")]: {
    width: "70%",
    margin: "auto",
  },
}));

const VerificationRule = styled(CenteringWrapper)({
  boxSizing: "border-box",
  display: "flex",
  minWidth: 200,
  maxWidth: 260,
  height: 108,
  background: "#F7F9FB",
  borderRadius: 14,
  padding: "28px 13px",
});

const VerificationRuleDescription = styled(Typography)({
  fontSize: 14,
  color: "#000",
});

interface Rule {
  icon: string;
  description: string;
}

const verificationRules: Rule[] = [
  {
    icon: paper,
    description: "This source code compiles to the same exact bytecode that is found on-chain.",
  },
  {
    icon: bomb,
    description:
      "You can review verification proofs and perform your own client-side verification.",
  },
  {
    icon: alert,
    description: "Variable names and function names may differ from original source code.",
  },
  {
    icon: binary,
    description: "Comments may not be honest and should generally be ignored.",
  },
];

export const VerificationInfoBlock = () => {
  const [urlParams] = useSearchParams();
  const [isPopupOpen, setPopupOpen] = React.useState(urlParams.get("showProof") !== null);
  const theme = useTheme();
  const headerSpacings = useMediaQuery(theme.breakpoints.down("lg"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isExtraSmallScreen = useMediaQuery("(max-width: 450px)");

  const onClose = () => setPopupOpen(false);

  return (
    <DataBox>
      <TitleBox mb={1}>
        <CenteringBox
          sx={{
            justifyContent: "space-between",
            flexDirection: isExtraSmallScreen ? "column" : "inherit",
            width: "100%",
          }}>
          <CenteringBox mb={isExtraSmallScreen ? 2 : 0} sx={{ width: "100%" }}>
            <IconBox>
              <img src={verification} alt="Verification icon" width={41} height={41} />
            </IconBox>
            <TitleText>How is this contract verified?</TitleText>
          </CenteringBox>
          <div>
            <AppButton
              fontSize={12}
              fontWeight={500}
              hoverBackground="#F5F5F5"
              background="#F2F2F2"
              height={37}
              width={132}
              onClick={() => {
                setPopupOpen(true);
              }}>
              <img src={show} alt="Show icon" width={19} height={19} />
              Show Proof
            </AppButton>
            {isPopupOpen && <VerificationProofPopup onClose={onClose} />}
          </div>
        </CenteringBox>
      </TitleBox>
      <VerificationRules makeFlexible={headerSpacings} isMobile={isSmallScreen}>
        {verificationRules.map((rule) => (
          <VerificationRule key={rule.description}>
            <CenteringWrapper sx={{ alignSelf: "flex-start" }} mr={1.5}>
              <img alt="Icon" src={rule.icon} width={41} height={41} />
            </CenteringWrapper>
            <VerificationRuleDescription>{rule.description}</VerificationRuleDescription>
          </VerificationRule>
        ))}
      </VerificationRules>
    </DataBox>
  );
};
