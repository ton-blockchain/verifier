import { styled } from "@mui/system";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import alert from "../assets/verification-alert.svg";
import binary from "../assets/verification-binary.svg";
import bomb from "../assets/verification-bomb.svg";
import paper from "../assets/verification-paper.svg";
import verification from "../assets/verification.svg";
import { CenteringWrapper } from "./Footer.styled";
import { CenteringBox, DataBox, IconBox, TitleBox, TitleText } from "./Common.styled";

interface VerificationRulesProps {
  makeFlexible?: boolean;
}

const VerificationRules = styled(CenteringBox, {
  shouldForwardProp: (prop) => prop !== "makeFlexible",
})<VerificationRulesProps>(({ theme, makeFlexible }) => ({
  flexWrap: makeFlexible ? "wrap" : "inherit",
  gap: makeFlexible ? 20 : "inherit",
  justifyContent: makeFlexible ? "center" : "space-between",
  padding: 24,
  [theme.breakpoints.down("lg")]: {
    width: "70%",
    margin: "auto",
  },
}));

const VerificationRule = styled(CenteringWrapper)({
  boxSizing: "border-box",
  display: "flex",
  minWidth: 180,
  maxWidth: 255,
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
    description:
      "Variable/function names may not reflect actual usage. compiler may remove unused code.",
  },
  {
    icon: binary,
    description: "Comments may not be honest and should generally be ignored.",
  },
];

export const VerificationInfoBlock = () => {
  const theme = useTheme();
  const headerSpacings = useMediaQuery(theme.breakpoints.down("lg"));
  const isExtraSmallScreen = useMediaQuery("(max-width: 450px)");

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
        </CenteringBox>
      </TitleBox>
      <VerificationRules makeFlexible={headerSpacings} sx={{ flexWrap: "wrap", gap: "5px" }}>
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
