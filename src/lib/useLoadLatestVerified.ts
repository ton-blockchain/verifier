import { useQuery } from "@tanstack/react-query";

import { randomFromArray, backends } from "./useSubmitSources";

export function useLoadLatestVerified() {
  const backend = randomFromArray(backends);

  const { isLoading, error, data } = useQuery(["latestVerifiedContracts"], async () => {
    const response = await fetch(`${backend}/latestVerified`, {
      method: "GET",
    });

    const latestVerified = (await response.json()) as {
      address: string;
      mainFile: string;
      compiler: string;
    }[];

    return latestVerified;
  });

  return { isLoading, error, data };
}
