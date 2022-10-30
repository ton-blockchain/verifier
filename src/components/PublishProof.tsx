import { Typography } from "@mui/material";
import { usePublishProof } from "../lib/usePublishProof";
import Button from "./Button";

function PublishProof() {
  const { mutate } = usePublishProof();

  return (
    <>
      <Typography>
        To store your contract’s verification proof on-chain, you will need to
        issue a transaction. This will cost 0.5 TON
      </Typography>
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
