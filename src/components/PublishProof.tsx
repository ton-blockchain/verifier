import { usePublishProof } from "../lib/usePublishProof";
import Button from "./Button";
import Spacer from "./Spacer";

function PublishProof() {
  const { mutate, status } = usePublishProof();

  return (
    <>
      <div
        style={{
          background: "#D8D8D840",
          border: "#D8D8D8",
          padding: 20,
          borderRadius: 20,
        }}
      >
        {status === "not_issued" &&
          `To store your contract’s verification proof on-chain, you will need to
          issue a transaction. This will cost 0.5 TON`}
        {status === "pending" &&
          `Check your tonhub wallet for a pending transaction`}
        {status === "rejected" && `Transaction rejected, please retry`}
        {status === "expired" && `Transaction expired, please retry`}
        {status === "success" &&
          `Transaction issued, monitoring proof deployment on-chain`}
        {status === "deployed" && `Your proof is ready!`}
      </div>
      <Spacer space={20} />
      <Button
        text="Publish"
        onClick={() => {
          mutate();
        }}
      />
    </>
  );
}

export default PublishProof;
