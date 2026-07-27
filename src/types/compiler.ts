export type FuncCompilerVersion = string;
export type TactVersion = string;
export type TolkVersion = string;
export type FiftVersion = string;

export type FuncCompilerSettings = {
  funcVersion: FuncCompilerVersion;
  commandLine: string;
};

export type FiftCliCompileSettings = {
  fiftVersion: FiftVersion;
  commandLine: string;
};

export type TactCliCompileSettings = {
  tactVersion: TactVersion;
};

export type TolkCliCompileSettings = {
  tolkVersion: TolkVersion;
};
