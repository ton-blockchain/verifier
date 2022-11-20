import { Box, Link, styled, Typography } from "@mui/material";

const FooterWrapper = styled(Box)({
  maxWidth: 1160,
  width: "calc(100% - 50px)",
  margin: "auto",
});

const SocialsWrapper = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
});

const SocialsContent = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(1.5),
}));

const CredentialsWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  color: "#728A96",
  fontSize: 14,
  [theme.breakpoints.down("md")]: {
    "& > *": {
      marginBottom: `${theme.spacing(1)} !important`,
    },
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const Separator = styled("hr")({
  height: "1px",
  backgroundColor: "#e6e6e6",
  border: "none",
});

const FooterLink = styled(Link)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  color: "inherit",
  textDecoration: "none",
  [theme.breakpoints.down("md")]: {
    justifyContent: "flex-end",
  },
}));

const CenteringWrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const FooterContributedText = styled(Typography)({
  fontSize: 12,
});

const ContributedWrapper = styled(CenteringWrapper)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    minWidth: "100%",
    flex: 2,
    order: 3,
  },
}));

const FooterTextBox = styled(CenteringWrapper)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    minWidth: "50%",
  },
}));

const FooterTextBoxLeft = styled(FooterTextBox)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    justifyContent: "start",
  },
  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
    minWidth: "100%",
  },
}));

const FooterTextBoxRight = styled(FooterTextBox)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    justifyContent: "end",
  },
  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
    minWidth: "100%",
  },
}));

export {
  FooterLink,
  FooterContributedText,
  ContributedWrapper,
  FooterTextBox,
  FooterTextBoxLeft,
  FooterTextBoxRight,
  CenteringWrapper,
  CredentialsWrapper,
  SocialsWrapper,
  SocialsContent,
  FooterWrapper,
  Separator,
};
