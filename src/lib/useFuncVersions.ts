import { useQuery } from "@tanstack/react-query";

const configURL =
  "https://raw.githubusercontent.com/ton-community/contract-verifier-config/main/config.json";

export function useFuncVersions() {
  return useQuery(
    ["funcVersions"],
    async () => {
      const { funcVersions } = await (await fetch(configURL)).json();

      return funcVersions as string[];
    },
    { staleTime: Infinity },
  );
}
