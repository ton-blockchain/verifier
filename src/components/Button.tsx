import "./Button.css";

function Button({
  text,
  onClick,
  disabled,
}: {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`Button ${disabled ? "Button-disabled" : ""}`}
      onClick={disabled ? undefined : onClick}
    >
      {text}
    </div>
  );
}

export default Button;
