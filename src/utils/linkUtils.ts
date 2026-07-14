import { FiftVersion, FuncCompilerVersion, TactVersion, TolkVersion } from "../types/compiler";

export const funcVersionToLink = (version: FuncCompilerVersion) =>
  `https://github.com/ton-blockchain/ton/tree/func-${version}/crypto/func`;

// Fift is tied to a FunC version
export const fiftVersionToLink = (version: FiftVersion) =>
  `https://github.com/ton-blockchain/ton/tree/func-${version}/crypto/fift`;

export const tactVersionToLink = (version: TactVersion) =>
  `https://github.com/tact-lang/tact/tree/v${version}`;

export const tolkVersionToLink = (version: TolkVersion) =>
  `https://github.com/ton-blockchain/ton/tree/tolk-${version}`;

export const dropPatchVersionZero = (version: string) => {
  const parsed = version.split(".");
  const chunksCount = parsed.length;

  if (chunksCount == 0) {
    return version;
  }

  return Number(parsed[chunksCount - 1]) == 0
    ? parsed.slice(0, chunksCount - 1).join(".")
    : version;
};
