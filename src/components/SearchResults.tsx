import { SearchRequest } from "./AddressInput";
import { Box, styled } from "@mui/system";
import { IconButton, Typography } from "@mui/material";
import { AppButton } from "./AppButton";
import close from "../assets/close.svg";
import recentSearch from "../assets/recent-search.svg";

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

const CenteringWrapper = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

const SearchResultsItem = styled(Box)(() => ({
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
}));

interface HeaderSearchResultsProps {
  searchResults: SearchRequest[];
  onItemClick: (item: SearchRequest) => void;
  onItemDelete: (e: React.MouseEvent, item: SearchRequest) => void;
  onHistoryClear: () => void;
}

export const SearchResults: React.FC<HeaderSearchResultsProps> = ({
  searchResults,
  onItemClick,
  onItemDelete,
  onHistoryClear,
}) => {
  return (
    <SearchResultsWrapper>
      {searchResults.map((result) => (
        <SearchResultsItem onClick={() => onItemClick(result)}>
          <CenteringWrapper>
            <CenteringWrapper mr={1.5}>
              <img width={18} height={18} src={recentSearch} alt="Search Icon" />
            </CenteringWrapper>
            <Typography>{result.value}</Typography>
          </CenteringWrapper>
          <IconButton onClick={(e) => onItemDelete(e, result)}>
            <img src={close} alt="Close Icon" width={16} height={16} />
          </IconButton>
        </SearchResultsItem>
      ))}
      <CenteringWrapper mt={2} mb={1} ml={1} sx={{ width: "fit-content" }}>
        <AppButton onClick={onHistoryClear} height={34} transparent>
          Clear History
        </AppButton>
      </CenteringWrapper>
    </SearchResultsWrapper>
  );
};
