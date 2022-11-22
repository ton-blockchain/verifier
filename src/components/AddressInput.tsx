import { useNavigate } from "react-router-dom";
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

const InputWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  height: 60,
  background: "#fff",
  borderRadius: 14,
  padding: "0 20px",
  zIndex: 9,
});

const AppAddressInput = styled("input")({
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: 60,
  outline: "unset",
  border: "none",
  padding: 0,
  paddingLeft: 5,
  fontSize: 16,
  background: "transparent",
  caretColor: "#728A96",
  "&::placeholder": {
    color: "#728A96",
  },
});

const examples_not_verified = [["wallet-v3", "EQBuOkznvkh_STO7F8W6FcoeYhP09jjO1OeXR2RZFkN6w7NR"]];

// to verify https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-auction-v2/nft-auction-v2.func
// EQCnTg1uvsqc1ZCSgEOl5Yk5LItktG6OOYrSQ8SnJP4FFa58

const examples = [
  ["dns-root", "Ef_lZ1T4NCb2mwkme9h2rJfESCE0W34ma9lWp7-_uY3zXDvq"],
  ["wallet-v4", "EQDerEPTIh0O8lBdjWc6aLaJs5HYqlfBN2Ruj1lJQH_6vcaZ"],
  ["dns-collection", "EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz"],
  ["dns-item", "EQAGSjhQajnMSne9c9hGnKdMKmohX2-MkZuOkk7TmwQKwFOU"],
  ["counter", "EQC-QTihJV_B4f8M2nynateMLynaRT_uwNYnnuyy87kam-G7"],
  ["jetton-minter-discoverable", "EQD-LkpmPTHhPW68cNfc7B83NcfE9JyGegXzAT8LetpQSRSm"],
  ["jetton-minter", "EQBb4JNqn4Z6U6-nf0cSLnOJo2dxj1QRuGoq-y6Hod72jPbl"],
  ["jetton-wallet", "EQAhuLHxOcrBwwMHKDnCUMYefuHwJ2iTOFKHWYQlDD-dgb__"],
  ["single-nominator", "Ef_BLbagjGnqZEkpURP96guu7M9aICAYe5hKB_P5Ng5Gju5Y"],
  ["sources-registry", "EQD-BJSVUJviud_Qv7Ymfd3qzXdrmV525e3YDzWQoHIAiInL"],
  ["nominator-pool", "Ef8iu8EiNOP2MczVvHseFi-CrGO1C4v6MkSSOgVZcESNGfT7"],
  ["telemint-item", "EQAwC64h_7B6YrmGlsto39tBcFWjjakGzSvV7QaMwXiMKy20"],
  ["telemint-collection", "EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi"],
  ["nft-item-v1", "EQCZLzCnJuXCBktkb5IiqANbgThvqo2hYXjpupdTe5yHV6oY"],
  ["elector", "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"],
  ["wallet-subscription-plugin", "EQAteJqywxP0g6-6e6LX7VRKKDmZDoQv1Mhx0hdslJvAUGEy"],
  ["sbt-item", "EQC7JOIVycOY_cQnNRVtEBk8DpEFClZM8S3TlqfuD72jvU59"],
  ["nft-single", "EQBPIJPKd1G8eJ8vIWUnkpRf-5rpRp_oqiOepv3Tf571LKbq"],
  ["nft-marketplace-v2", "EQBYTuYbLf8INxFtD8tQeNk5ZLy-nAX9ahQbG_yl1qQ-GEMS"],
  ["nft-item-editable", "EQC2VNMbjQ8BY8b4iXTEop7dxNgYEXPAlr6ph1I-h42LrdED"],
  ["nft-offer", "EQA6rqhL9hxd8c3c1JVYQPohQVicy8PEZibTgF60iQCSEk1c"],
  ["nft-fixprice-sale-v2", "EQBeaUJdPdO66uL-P_D7-oHClw6uYIAPxoo9CX-TE6psn6lk"],
  ["nft-fixprice-sale-v3", "EQCljxPgw_0Z0uELYyt7AoGsmtGP7ORB-A4jk-gyuNJIjsRW"],
  ["nft-collection-editable", "EQCHmW1OkT6_-_vO6zoSFW9Z2T62dhffNZkkKRpdaPTFLPdT"],
  ["nft-auction", "EQC1yTmHvpD5z4Dk_l-YnEhZclc06utSisqhthfzBGz-w0Ae"],
];

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
              <IconButton onClick={onClear}>
                <img src={close} width={16} height={16} alt="Close icon" />
              </IconButton>
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
          {import.meta.env.DEV && active && (
            <div
              style={{
                padding: 2,
                background: "#000000",
                gap: 10,
                display: "flex",
                textAlign: "center",
              }}>
              {examples.concat(examples_not_verified).map(([name, address]) => (
                <div
                  style={{
                    color: "white",
                    cursor: "pointer",
                  }}
                  key={name}
                  onClick={(e) => {
                    navigate(`/${address}`);
                  }}>
                  {name}
                </div>
              ))}
            </div>
          )}
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
