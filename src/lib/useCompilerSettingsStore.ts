import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { useFileStore } from "./useFileStore";

export type FuncCliCompilerVersion = "0.2.0" | "0.3.0";
export type Compiler = "cli:func" | "npm:ton-compiler";

export type UserProvidedFuncCliCompileSettings = {
  funcVersion: FuncCliCompilerVersion;
  commandLine: string;
  overrideCommandLine: string | null;
};

export type NpmTonCompilerVersion = "v2022.10";

export type UserProvidedNpmTonCompilerSettings = {
  version: NpmTonCompilerVersion;
};

type State = {
  compiler: Compiler;
  compilerSettings: UserProvidedNpmTonCompilerSettings | UserProvidedFuncCliCompileSettings;
};

type DerivedState = {};

type Actions = {
  setCompiler: (compiler: Compiler) => void;
  setCompilerSettings: (
    settings: UserProvidedFuncCliCompileSettings | UserProvidedNpmTonCompilerSettings,
  ) => void;
  setOverrideCommandLine: (overrideCommandLine: string | null) => void;
  setFuncCliVersion: (funcVersion: FuncCliCompilerVersion) => void;
  setNpmTonCompilerVersion: (funcVersion: NpmTonCompilerVersion) => void;
};

const INITIAL_FUNC_CLI_SETTINGS: () => UserProvidedFuncCliCompileSettings = () => ({
  funcVersion: "0.3.0",
  commandLine: "",
  overrideCommandLine: null,
});

const INITIAL_NPM_TON_COMPILER_SETTINGS: () => UserProvidedNpmTonCompilerSettings = () => ({
  version: "v2022.10",
});

const _useCompilerSettingsStore = create(
  immer<State & DerivedState & Actions>((set, get) => ({
    // State
    compiler: "cli:func" as Compiler,
    compilerSettings: { funcVersion: "0.3.0", commandLine: "" } as
      | UserProvidedFuncCliCompileSettings
      | UserProvidedNpmTonCompilerSettings,

    // Derived

    // Actions
    setCompiler: (compiler: Compiler) => {
      set((state) => {
        state.compiler = compiler;
        if (state.compiler === "cli:func") {
          state.compilerSettings = INITIAL_FUNC_CLI_SETTINGS();
        } else if (state.compiler === "npm:ton-compiler") {
          state.compilerSettings = INITIAL_NPM_TON_COMPILER_SETTINGS();
        } else {
          throw new Error("unknown compiler");
        }
      });
    },
    setCompilerSettings: (
      settings: UserProvidedFuncCliCompileSettings | UserProvidedNpmTonCompilerSettings,
    ) => {
      set((state) => {
        state.compilerSettings = settings;
      });
    },

    setOverrideCommandLine: (overrideCommandLine: string | null) => {
      set((state) => {
        if (state.compiler !== "cli:func") {
          throw new Error("not func compiler");
        }
        (state.compilerSettings as UserProvidedFuncCliCompileSettings).overrideCommandLine =
          overrideCommandLine;
      });
    },

    setFuncCliVersion: (funcVersion: FuncCliCompilerVersion) => {
      set((state) => {
        if (state.compiler !== "cli:func") {
          throw new Error("not func compiler");
        }
        (state.compilerSettings as UserProvidedFuncCliCompileSettings).funcVersion = funcVersion;
      });
    },

    setNpmTonCompilerVersion: (version: NpmTonCompilerVersion) => {
      set((state) => {
        if (state.compiler !== "npm:ton-compiler") {
          throw new Error("not npm ton compiler");
        }
        (state.compilerSettings as UserProvidedNpmTonCompilerSettings).version = version;
      });
    },
  })),
);

export function useCompilerSettingsStore() {
  const { files, setInclueInCommand } = useFileStore();
  const compilerStore = _useCompilerSettingsStore();

  function prepareCommandLine() {
    const cmd = files
      .filter((f) => f.includeInCommand)
      .map((f) => (f.folder ? f.folder + "/" : "") + f.fileObj.name)
      .join(" ");

    if (!files) return "";
    return `-SPA ${cmd}`;
  }

  const additionalCompilerSettings: Partial<UserProvidedFuncCliCompileSettings> = {};

  if (compilerStore.compiler === "cli:func") {
    additionalCompilerSettings.commandLine =
      (compilerStore.compilerSettings as UserProvidedFuncCliCompileSettings).overrideCommandLine ??
      prepareCommandLine();
  } else if (compilerStore.compiler === "npm:ton-compiler") {
    files.forEach((f) => setInclueInCommand(f.fileObj.name, true));
  }

  return {
    ...compilerStore,
    compilerSettings: { ...compilerStore.compilerSettings, ...additionalCompilerSettings },
  };
}
