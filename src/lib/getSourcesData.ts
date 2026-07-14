import {
  FiftCliCompileSettings,
  FuncCompilerSettings,
  TactCliCompileSettings,
  TolkCliCompileSettings,
} from "../types/compiler";
import { fetchIpfsContent } from "./fetchIpfsContent";

export type FuncSource = {
  name: string;
  content: string;
  isEntrypoint: boolean;
};

export type TactSource = {
  name: string;
  content: string;
  isEntrypoint?: boolean;
};

export type TolkSource = {
  name: string;
  content: string;
  isEntrypoint?: boolean;
};

export type MissingSource = {
  name: string;
  isEntrypoint: boolean;
  error: string;
};

export type SourceFile = TactSource | FuncSource | TolkSource | MissingSource;

export function isMissingSource(source: SourceFile): source is MissingSource {
  return "error" in source;
}

export type ValidSource = TactSource | FuncSource | TolkSource;

export function getValidSources(files: SourceFile[] | undefined): ValidSource[] {
  return (files ?? []).filter((f): f is ValidSource => !isMissingSource(f));
}

export interface SourcesData {
  files: SourceFile[];
  compiler: "func" | "tact" | "fift" | "tolk";
  compilerSettings:
    | FuncCompilerSettings
    | FiftCliCompileSettings
    | TolkCliCompileSettings
    | TactCliCompileSettings;
  verificationDate: Date;
  ipfsHttpLink: string;
}

function extractIpfsHash(url: string): string {
  const match = url.match(/ipfs\/([a-zA-Z0-9]+)/);
  if (match) {
    return match[1];
  }
  if (url.startsWith("ipfs://")) {
    return url.slice(7);
  }
  return url;
}

export async function getSourcesData(sourcesJsonUrl: string): Promise<SourcesData> {
  const hash = extractIpfsHash(sourcesJsonUrl);
  const { response, url: ipfsHttpLink } = await fetchIpfsContent(hash);
  if (response.status >= 400) {
    throw new Error(await response.text());
  }
  const verifiedContract = await response.json();

  const files: SourceFile[] = (
    await Promise.all(
      verifiedContract.sources.map(
        async (source: { url: string; filename: string; isEntrypoint?: boolean }) => {
          const { response: resp } = await fetchIpfsContent(extractIpfsHash(source.url));
          if (resp.status >= 400) {
            return {
              name: source.filename,
              isEntrypoint: source.isEntrypoint,
              error: await resp.text(),
            };
          }
          const content = await resp.text();
          return {
            name: source.filename,
            isEntrypoint: source.isEntrypoint,
            content,
          };
        },
      ),
    )
  )
    .reverse()
    .sort((a, b) => {
      return Number(b.isEntrypoint) - Number(a.isEntrypoint);
    });

  return {
    files,
    verificationDate: new Date(verifiedContract.verificationDate),
    compilerSettings: verifiedContract.compilerSettings,
    compiler: verifiedContract.compiler,
    ipfsHttpLink,
  };
}
