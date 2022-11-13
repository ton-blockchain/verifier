import { useLoadContractInfo } from "../lib/useLoadContractInfo";
import InfoPiece from "./InfoPiece";
import { workchainForAddress } from "../lib/workchainForAddress";
import { useContractAddress } from "../lib/useContractAddress";

function ContractInfo() {
  const { contractAddress } = useContractAddress();
  const { data, isLoading } = useLoadContractInfo();
  return (
    <>
      <h3>Contract</h3>
      <InfoPiece label="Address" data={contractAddress ?? ""} />
      {isLoading && <div>Loading...</div>}
      {data && (
        <div>
          <InfoPiece label="Balance" data={data.balance} />
          <InfoPiece label="Hash" data={data.hash} />
          <InfoPiece label="Workchain" data={workchainForAddress(contractAddress ?? "")} />
        </div>
      )}
    </>
  );
}

export default ContractInfo;
