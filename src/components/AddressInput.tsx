import { useSearchParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import search from "../assets/search.svg";
import close from "../assets/close.svg";
import { Backdrop, Box, ClickAwayListener, Fade, IconButton } from "@mui/material";
import { animationTimeout } from "../const";
import { SearchResults } from "../components/SearchResults";
import { DevExamples } from "./DevExamples";
import { AppButton } from "./AppButton";
import { CenteringBox } from "./Common.styled";
import { useAddressInput } from "../lib/useAddressInput";

const InputWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  height: 48,
  background: "#F7F9FB",
  borderRadius: 40,
  border: "0.5px solid rgba(114, 138, 150, 0.16)",
  padding: "0 10px 0 20px",
  zIndex: 9,
});

const AppAddressInput = styled("input")(({ theme }) => ({
  flex: 1,
  marginLeft: 10,
  width: "100%",
  height: 48,
  fontSize: 16,
  fontWeight: 500,
  outline: "unset",
  fontFamily: "Mulish",
  color: "#000",
  border: "none",
  background: "transparent",
  caretColor: "#728A96",
  "&::placeholder": {
    color: "#728A96",
    fontWeight: 500,
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: 16,
  },
}));

export interface SearchRequest {
  index: number;
  value: string;
}

export function AddressInput() {
  const { onSubmit, onItemDelete, onItemClick, onHistoryClear, onClear, searchBar, setSearchBar } =
    useAddressInput();
  const [urlParams] = useSearchParams();
  const showDevExamples = urlParams.get("devExamples") !== null;

  return (
    <ClickAwayListener
      onClickAway={() =>
        setSearchBar((old) => ({
          ...old,
          active: false,
        }))
      }>
      <>
        <Box sx={{ position: "relative", maxWidth: 1160, width: "100%", zIndex: 3 }}>
          <InputWrapper>
            <img width={24} height={24} src={search} alt="Search icon" />
            <AppAddressInput
              placeholder="Contract address"
              value={searchBar.value}
              onChange={(e) =>
                setSearchBar((old) => ({
                  ...old,
                  value: e.target.value,
                }))
              }
              onSubmit={onSubmit}
              onFocus={() =>
                setSearchBar((old) => ({
                  ...old,
                  active: true,
                }))
              }
              spellCheck={false}
            />
            <Fade in={!!searchBar.value} timeout={animationTimeout}>
              <CenteringBox>
                <IconButton onClick={onClear}>
                  <img src={close} width={16} height={16} alt="Close icon" />
                </IconButton>
                <AppButton
                  height={34}
                  width={40}
                  textColor="#fff"
                  background="rgb(0, 136, 204)"
                  hoverBackground="rgb(0, 95, 142)"
                  fontWeight={600}
                  onClick={onSubmit}>
                  Go
                </AppButton>
              </CenteringBox>
            </Fade>
          </InputWrapper>
          {searchBar.active && !!searchBar.searchResults?.length && (
            <SearchResults
              searchResults={searchBar?.searchResults}
              onItemClick={onItemClick}
              onItemDelete={onItemDelete}
              onHistoryClear={onHistoryClear}
            />
          )}
          {(showDevExamples || import.meta.env.DEV) && searchBar.active && <DevExamples />}
        </Box>
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: 1,
            overflow: "hidden",
          }}
          invisible={!searchBar.searchResults?.length}
          open={searchBar.active}
          onClick={() =>
            setSearchBar((old) => ({
              ...old,
              active: false,
            }))
          }
        />
      </>
    </ClickAwayListener>
  );
}
