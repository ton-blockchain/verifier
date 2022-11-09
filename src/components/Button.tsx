import "./Button.css";
import { Button as MUIButton, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { fontWeight } from "@mui/system";

const StyledButton = styled(MUIButton)({
  borderRadius: 40,
  fontFamily: "Mulish-Bold, sans-serif",
  textTransform: "none",
  // color: "fff",
  // boxShadow: "none",
  // textTransform: "none",
  // fontSize: 16,
  // border: "1px solid",
  // lineHeight: 1.5,
  // // backgroundColor: "#0063cc",
  // // borderColor: "#0063cc",
  // "&:hover": {
  //   backgroundColor: "#0069d9",
  //   borderColor: "#0062cc",
  //   boxShadow: "none",
  // },
  // "&:active": {
  //   boxShadow: "none",
  //   backgroundColor: "#0062cc",
  //   borderColor: "#005cbf",
  // },
  "&:disabled": {
    backgroundColor: "#e0e0e0",
  },
});

function Button(
  props: {
    text: string;
  } & ButtonProps,
) {
  return (
    <StyledButton
      disableElevation
      disableRipple
      disableFocusRipple
      disableTouchRipple
      variant="contained"
      disabled={props.disabled}
      onClick={props.disabled ? undefined : props.onClick}
      {...props}>
      {props.text}
    </StyledButton>
  );
}

export default Button;
