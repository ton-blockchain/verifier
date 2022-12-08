import { FiftVersion, FuncCompilerVersion } from "@ton-community/contract-verifier-sdk";

export const funcVersionToLink = (version: FuncCompilerVersion) =>
  `https://github.com/ton-blockchain/ton/tree/func-${version}/crypto/func`;

// Fift is tied to a FunC version
export const fiftVersionToLink = (version: FiftVersion) =>
  `https://github.com/ton-blockchain/ton/tree/func-${version}/crypto/fift`;
