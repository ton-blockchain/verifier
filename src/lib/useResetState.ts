import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSubmitSources } from "./useSubmitSources";
import { useFileStore } from "./useFileStore";
import { useContractAddress } from "./useContractAddress";
import { usePublishStore } from "./usePublishSteps";

export function useResetState() {
  const { contractAddress } = useContractAddress();
  const submitSourcesState = useSubmitSources();
  const { reset: resetFileStore } = useFileStore();
  const { reset: resetPublishStore } = usePublishStore();
  useEffect(() => {
    resetFileStore();
    resetPublishStore();
    submitSourcesState.invalidate();
  }, [contractAddress]);
}
