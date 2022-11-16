//TODO replace with AppButton and delete
import "./Button.css";
import { Button as MUIButton, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledButton = styled(MUIButton)({
  borderRadius: 40,
  fontFamily: "inherit",
  fontWeight: 700,
  textTransform: "none",
  background: "#0088CC",
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
