import { SearchRequest } from "./AddressInput";
import { IconButton, Typography } from "@mui/material";
import { AppButton } from "./AppButton";
import close from "../assets/close.svg";
import recentSearch from "../assets/recent-search.svg";
import { CenteringBox } from "./common.styled";
import { SearchResultsItem, SearchResultsWrapper } from "./searchRusults.styled";

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
          <CenteringBox>
            <CenteringBox mr={1.5}>
              <img width={18} height={18} src={recentSearch} alt="Search Icon" />
            </CenteringBox>
            <Typography>{result.value}</Typography>
          </CenteringBox>
          <IconButton onClick={(e) => onItemDelete(e, result)}>
            <img src={close} alt="Close Icon" width={16} height={16} />
          </IconButton>
        </SearchResultsItem>
      ))}
      <CenteringBox mt={2} mb={1} ml={1} sx={{ width: "fit-content" }}>
        <AppButton onClick={onHistoryClear} height={34} transparent>
          Clear History
        </AppButton>
      </CenteringBox>
    </SearchResultsWrapper>
  );
};
