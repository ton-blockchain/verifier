import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContractAddress } from "../lib/useContractAddress";
import { styled } from "@mui/material/styles";
import search from "../assets/search.svg";
import close from "../assets/close.svg";
import { Box, Fade, IconButton } from "@mui/material";
import { animationTimeout } from "../const";

const InputWrapper = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: 60,
  background: "#fff",
  borderRadius: 14,
  padding: "0 20px",
}));

const AppAddressInput = styled("input")(() => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: 60,
  outline: "unset",
  border: "none",
  padding: 0,
  paddingLeft: 5,
  fontSize: 16,
  "&::placeholder": {
    color: "#000",
  },
}));

export function AddressInput() {
  const { contractAddress } = useContractAddress();
  const [value, setValue] = useState(contractAddress ?? "");

  useEffect(() => {
    setValue(contractAddress ?? "");
  }, [contractAddress]);

  const onClear = () => setValue("");

  const navigate = useNavigate();
  return (
    <InputWrapper>
      <img width={24} height={24} src={search} alt="Search icon" />
      <AppAddressInput
        placeholder="Paste address here"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
        onKeyDown={(e: any) => {
          if (e.keyCode === 13) {
            navigate(`/${e.target.value}`);
          }
        }}
      />
      <Fade in={!!value} timeout={animationTimeout}>
        <IconButton onClick={onClear}>
          <img src={close} width={16} height={16} alt="Close icon" />
        </IconButton>
      </Fade>
    </InputWrapper>
  );
}
