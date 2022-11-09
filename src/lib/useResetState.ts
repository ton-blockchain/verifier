import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSubmitSources } from "./useSubmitSources";
import { useFileStore } from "./useFileStore";
import { useContractAddress } from "./useContractAddress";

export function useResetState() {
  const { contractAddress } = useContractAddress();
  const submitSourcesState = useSubmitSources();
  const { reset: resetFileStore } = useFileStore();
  useEffect(() => {
    resetFileStore();
    submitSourcesState.invalidate();
  }, [contractAddress]);
}
