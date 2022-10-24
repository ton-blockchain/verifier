import "./Button.css";

function Button({ text }: { text: string }) {
  return <div className="Button">{text}</div>;
}

export default Button;
