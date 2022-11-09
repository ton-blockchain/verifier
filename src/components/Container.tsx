import "./Container.css";

function Container({ children, className }: { children: any; className?: string }) {
  return <div className={`Container ${className ?? ""}`}>{children}</div>;
}

export default Container;
