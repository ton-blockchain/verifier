import { FiftVersion, FuncCompilerVersion } from "@ton-community/contract-verifier-sdk";

// Fift is tied to a FunC version
export const fiftVersionToLink = (version: FuncCompilerVersion) =>
  `https://github.com/ton-blockchain/ton/releases/tag/func-${version}`;

export const funcVersionToLink = (version: FiftVersion) =>
  `https://github.com/ton-blockchain/ton/releases/tag/func-${version}`;
