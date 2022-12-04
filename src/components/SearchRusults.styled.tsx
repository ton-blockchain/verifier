import { Box, styled } from "@mui/system";

const SearchResultsWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "calc(100% + 10px)",
  left: 0,
  padding: `${theme.spacing(1)}, ${theme.spacing(2)}`,
  zIndex: 99,
  background: "rgba(232,233,235)",
  border: "0.5px solid rgba(114, 138, 150, 0.16)",
  borderRadius: 16,
  width: "100%",
  maxHeight: 450,
  overflowY: "auto",

  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const SearchResultsItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "transparent",
  fontSize: 20,
  color: "#000",
  fontWeight: 500,
  height: 30,
  padding: "20px 21px",
  transitionDuration: ".15s",
  "&:hover": {
    cursor: "pointer",
    background: "rgb(225,227,230)",
  },
});

export { SearchResultsItem, SearchResultsWrapper };
