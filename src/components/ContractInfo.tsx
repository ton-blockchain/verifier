import { useParams } from "react-router-dom";
import Container from "./Container";
import "./ContractInfo.css";
import { useLoadContractInfo } from "../lib/useLoadContractInfo";
import InfoPiece from "./InfoPiece";
import { workchainForAddress } from "../lib/workchainForAddress";

function ContractInfo() {
  const { contractAddress } = useParams();
  const { data, isLoading } = useLoadContractInfo();
  return (
    <Container className="ContractInfo">
      <h3 style={{ textAlign: "center" }}>Contract</h3>
      <InfoPiece label="Address" data={useParams().contractAddress ?? ""} />
      {isLoading && <div>Loading...</div>}
      {data && (
        <div>
          <InfoPiece label="Balance" data={data.balance} />
          <InfoPiece label="Hash" data={data.hash} />
          <InfoPiece label="Workchain" data={workchainForAddress(contractAddress ?? "")} />
        </div>
      )}
    </Container>
  );
}

export default ContractInfo;
