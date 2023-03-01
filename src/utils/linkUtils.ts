import {
  FiftVersion,
  FuncCompilerVersion,
  TactVersion,
} from "@ton-community/contract-verifier-sdk";

export const funcVersionToLink = (version: FuncCompilerVersion) =>
  `https://github.com/ton-blockchain/ton/tree/func-${version}/crypto/func`;

// Fift is tied to a FunC version
export const fiftVersionToLink = (version: FiftVersion) =>
  `https://github.com/ton-blockchain/ton/tree/func-${version}/crypto/fift`;

export const tactVersionToLink = (version: TactVersion) =>
  `https://github.com/tact-lang/tact/tree/v${version}`;
