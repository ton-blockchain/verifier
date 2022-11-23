import { useLoadContractSourceCode } from "../lib/useLoadContractSourceCode";
import { Box, styled } from "@mui/system";
import { Typography } from "@mui/material";
import alert from "../assets/verification-alert.svg";
import binary from "../assets/verification-binary.svg";
import bomb from "../assets/verification-bomb.svg";
import paper from "../assets/verification-paper.svg";
import pen from "../assets/verification-pen.svg";
import { CenteringWrapper } from "./footer.styled";

const VerificationRulesWrapper = styled(Box)({
  minWidth: 320,
  maxWidth: 320,
  backgroundColor: "#f7f9fb",
  border: "1px solid #728a9619",
  borderRadius: 20,
  padding: "20px 10px",
});

const VerificationRulesTitle = styled(Typography)({
  textAlign: "center",
  fontSize: 16,
  color: "#000",
  fontWeight: 800,
});

const VerificationRules = styled(Box)({
  padding: 25,
});

const VerificationRule = styled(CenteringWrapper)({
  marginBottom: 32,
});

const VerificationRuleDescription = styled(Typography)({
  fontSize: 14,
  color: "#728A96",
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
    icon: pen,
    description:
      "Compilation verification was performed by 20 independent validators of Orbs Network - a TON side-chain staked with over $100M.",
  },
  {
    icon: bomb,
    description:
      "You can review the verification proofs and perform your own client-side verification.",
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

export function VerifiedSourceCode() {
  const { hasOnchainProof } = useLoadContractSourceCode();

  return (
    <div id="myVerifierContainer" style={{ height: 600, color: "black" }}>
      <div id="myVerifierFiles"></div>
      <div id="myVerifierContent"></div>
      <VerificationRulesWrapper>
        <VerificationRulesTitle>How is this contract verified?</VerificationRulesTitle>
        <VerificationRules>
          {verificationRules.map((rule) => (
            <VerificationRule>
              <CenteringWrapper mr={1.5}>
                <img alt="Icon" src={rule.icon} width={41} height={41} />
              </CenteringWrapper>
              <VerificationRuleDescription>{rule.description}</VerificationRuleDescription>
            </VerificationRule>
          ))}
        </VerificationRules>
      </VerificationRulesWrapper>
    </div>
  );
}
