import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const configURL =
  "https://raw.githubusercontent.com/ton-community/contract-verifier-config/main/config.json";

export function useRemoteConfig() {
  const [enabled, setEnabled] = useState(true);

  return useQuery(
    ["remoteConfig"],
    async () => {
      const config: {
        funcVersions: string[];
        tactVersions: string[];
        tolkVersions: string[];
        backends: string[];
        backendsTestnet: string[];
      } = await (await fetch(configURL)).json();

      setEnabled(false);

      return config;
    },
    {
      enabled,
      initialData: {
        funcVersions: [],
        tactVersions: [],
        tolkVersions: [],
        backends: [],
        backendsTestnet: [],
      },
    },
  );
}
