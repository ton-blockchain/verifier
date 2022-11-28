import { FuncCompilerVersion } from "@ton-community/contract-verifier-sdk";

export const fiftLibVersionToLink = (version: string) =>
  `https://github.com/ton-blockchain/ton/tree/${version}/crypto/fift/lib`;

export const fiftVersionToLink = (version: string) =>
  `https://github.com/ton-blockchain/ton/tree/${version}/crypto/fift`;

export const funcVersionToLink = (version: FuncCompilerVersion) =>
  `https://github.com/ton-blockchain/ton/releases/tag/func-${version}`;
