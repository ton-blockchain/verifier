import { useNavigate, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import search from "../assets/search.svg";
import close from "../assets/close.svg";
import { Backdrop, Box, ClickAwayListener, Fade, IconButton } from "@mui/material";
import { animationTimeout, SEARCH_HISTORY } from "../const";
import { useLocalStorage } from "../lib/useLocalStorage";
import { isValidAddress } from "../utils";
import useNotification from "../lib/useNotification";
import { SearchResults } from "../components/SearchResults";
import { DevExamples } from "./DevExamples";
import { AppButton } from "./AppButton";
import { CenteringBox } from "./common.styled";

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
  const [value, setValue] = useState("");
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [searchResults, setSearchResults] = useState<SearchRequest[]>([]);
  const { storedValue: searchDupResults, setValue: setSearchDupResults } = useLocalStorage<
    SearchRequest[]
  >(SEARCH_HISTORY, []);
  const [urlParams] = useSearchParams();
  const showDevExamples = urlParams.get("devExamples") !== null;

  const onClear = useCallback(() => setValue(""), []);

  const onItemClick = useCallback((item: SearchRequest) => {
    setActive(false);
    navigate(`/${item.value}`);
  }, []);

  const onHistoryClear = useCallback(() => {
    setSearchResults([]);
  }, []);

  const onItemDelete = useCallback(
    (e: React.MouseEvent, item: SearchRequest) => {
      e.stopPropagation();
      setSearchResults((prev) => prev.filter((result) => result.value !== item.value));
    },
    [searchResults],
  );

  const onSubmit = async () => {
    const isAlreadyInTheList = searchDupResults.find((item) => {
      return item.value === value;
    });

    if (!value) {
      setValue("");
      setActive(false);
      navigate("/");
      return;
    }

    if (!isValidAddress(value)) {
      showNotification("Invalid address", "error");
      return;
    }

    !isAlreadyInTheList &&
      setSearchResults((prevState) => [...prevState, { index: searchDupResults?.length, value }]);

    setValue("");
    setActive(false);
    navigate(`/${value}`);
  };

  useEffect(() => {
    setSearchDupResults(searchResults);
  }, [searchResults]);

  useEffect(() => {
    const listener = (e: any) => {
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        onSubmit();
        e.target.blur();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [value]);

  return (
    <ClickAwayListener onClickAway={() => setActive(false)}>
      <>
        <Box sx={{ position: "relative", maxWidth: 1160, width: "100%", zIndex: 3 }}>
          <InputWrapper>
            <img width={24} height={24} src={search} alt="Search icon" />
            <AppAddressInput
              placeholder="Contract address"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onSubmit={onSubmit}
              onFocus={() => setActive(true)}
              spellCheck={false}
            />
            <Fade in={!!value} timeout={animationTimeout}>
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
          {active && !!searchResults.length && (
            <SearchResults
              searchResults={searchResults}
              onItemClick={onItemClick}
              onItemDelete={onItemDelete}
              onHistoryClear={onHistoryClear}
            />
          )}
          {(showDevExamples || import.meta.env.DEV) && active && <DevExamples />}
        </Box>
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: 1,
            overflow: "hidden",
          }}
          invisible={!searchResults.length}
          open={active}
          onClick={() => setActive(false)}
        />
      </>
    </ClickAwayListener>
  );
}
