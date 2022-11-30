import React from "react";
import { styled } from "@mui/system";
import { Typography } from "@mui/material";
import alert from "../assets/verification-alert.svg";
import binary from "../assets/verification-binary.svg";
import bomb from "../assets/verification-bomb.svg";
import paper from "../assets/verification-paper.svg";
import show from "../assets/show.svg";
import verification from "../assets/verification.svg";
import { CenteringWrapper } from "./footer.styled";
import { CenteringBox, DataBox, IconBox, TitleBox, TitleText } from "./common.styled";
import { AppButton } from "./AppButton";
import { VerificationProofPopup } from "./VerificationProofPopup";

const VerificationRules = styled(CenteringBox)({
  justifyContent: "space-between",
  padding: 24,
});

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
  const [isPopupOpen, setPopupOpen] = React.useState(false);

  const onClose = () => setPopupOpen(false);

  return (
    <DataBox>
      <TitleBox mb={1}>
        <CenteringBox sx={{ justifyContent: "space-between", width: "100%" }}>
          <CenteringBox sx={{ width: "100%" }}>
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
      <VerificationRules>
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
