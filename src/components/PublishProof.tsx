import { Typography } from "@mui/material";
import { usePublishProof } from "../lib/usePublishProof";
import Button from "./Button";
import Spacer from "./Spacer";

function PublishProof() {
  const { mutate, data } = usePublishProof();

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
        To store your contract’s verification proof on-chain, you will need to
        issue a transaction. This will cost 0.5 TON
      </div>
      <Spacer space={20} />
      <div>{JSON.stringify(data)}</div>
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
