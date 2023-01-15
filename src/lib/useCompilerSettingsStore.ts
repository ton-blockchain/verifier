import { useEffect } from "react";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { useFileStore } from "./useFileStore";

export type FuncCliCompilerVersion = "0.2.0" | "0.3.0" | "0.4.0";
export type Compiler = "func" | "fift" | "tact";

export type UserProvidedFuncCompileSettings = {
  funcVersion: FuncCliCompilerVersion;
  commandLine: string;
  overrideCommandLine: string | null;
};

type State = {
  compiler: Compiler;
  compilerSettings: UserProvidedFuncCompileSettings;
};

type DerivedState = {};

type Actions = {
  setCompilerSettings: (settings: UserProvidedFuncCompileSettings) => void;
  setOverrideCommandLine: (overrideCommandLine: string | null) => void;
  setFuncCliVersion: (funcVersion: FuncCliCompilerVersion) => void;
  setCompiler: (compiler: Compiler) => void;
};

const _useCompilerSettingsStore = create(
  immer<State & DerivedState & Actions>((set, get) => ({
    // State
    compiler: "func" as Compiler,
    compilerSettings: { funcVersion: "0.4.0", commandLine: "" } as UserProvidedFuncCompileSettings,

    // Derived

    // Actions
    setCompilerSettings: (settings: UserProvidedFuncCompileSettings) => {
      set((state) => {
        state.compilerSettings = settings;
      });
    },

    setOverrideCommandLine: (overrideCommandLine: string | null) => {
      set((state) => {
        if (state.compiler !== "func") {
          throw new Error("not func compiler");
        }
        (state.compilerSettings as UserProvidedFuncCompileSettings).overrideCommandLine =
          overrideCommandLine;
      });
    },

    setFuncCliVersion: (funcVersion: FuncCliCompilerVersion) => {
      set((state) => {
        if (state.compiler !== "func") {
          throw new Error("not func compiler");
        }
        (state.compilerSettings as UserProvidedFuncCompileSettings).funcVersion = funcVersion;
      });
    },

    setCompiler: (compiler: Compiler) => {
      set((state) => {
        state.compiler = compiler;
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

  useEffect(() => {
    if (files.some((f) => f.fileObj.name.endsWith(".tact"))) {
      compilerStore.setCompiler("tact");
    }
  }, [files]);

  const additionalCompilerSettings: Partial<UserProvidedFuncCompileSettings> = {};

  if (compilerStore.compiler === "func") {
    additionalCompilerSettings.commandLine =
      (compilerStore.compilerSettings as UserProvidedFuncCompileSettings).overrideCommandLine ??
      prepareCommandLine();
  }

  return {
    ...compilerStore,
    compilerSettings: { ...compilerStore.compilerSettings, ...additionalCompilerSettings },
  };
}
