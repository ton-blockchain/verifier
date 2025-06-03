import { useQuery } from "@tanstack/react-query";

import { randomFromArray, useBackends } from "./useSubmitSources";

export function useLoadLatestVerified() {
  const backends = useBackends();
  const backend = randomFromArray(backends);

  const { isLoading, error, data } = useQuery(
    ["latestVerifiedContracts"],
    async () => {
      const response = await fetch(`${backend}/latestVerified`, {
        method: "GET",
      });

      const latestVerified = (
        (await response.json()) as {
          address: string;
          mainFile: string;
          compiler: string;
        }[]
      ).slice(0, 100);

      return latestVerified;
    },
    { enabled: backends.length > 0 },
  );

  return { isLoading, error, data };
}
