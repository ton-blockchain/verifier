import "./InfoPiece.css";

function InfoPiece({ label, data }: { label: string; data: string }) {
  return (
    <div className="InfoPiece">
      <div className="InfoPiece-Label">{label}</div>
      <div className="InfoPiece-Data">{data}</div>
    </div>
  );
}

export default InfoPiece;
