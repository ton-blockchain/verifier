import { useEffect } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useFileStore } from "./useFileStore";
import { FuncCompilerVersion, TactVersion } from "@ton-community/contract-verifier-sdk";
import { PackageFileFormat } from "@tact-lang/compiler";
import { useRemoteConfig } from "./useRemoteConfig";

export type Compiler = "func" | "fift" | "tact";

export type UserProvidedFuncCompileSettings = {
  funcVersion: FuncCompilerVersion;
  commandLine: string;
  overrideCommandLine: string | null;
};

export type UserProvidedTactCompileSettings = {
  tactVersion: TactVersion;
};

type State = {
  compiler: Compiler;
  compilerSettings: UserProvidedFuncCompileSettings | UserProvidedTactCompileSettings;
  _defaultFuncVersion: FuncCompilerVersion;
};

type DerivedState = {};

type Actions = {
  setCompilerSettings: (
    settings: UserProvidedFuncCompileSettings | UserProvidedTactCompileSettings,
  ) => void;
  setOverrideCommandLine: (overrideCommandLine: string | null) => void;
  setFuncCliVersion: (funcVersion: FuncCompilerVersion) => void;
  setTactCliVersion: (tactVersion: TactVersion) => void;
  setCompiler: (compiler: Compiler) => void;
  initialize: (defaultFuncVersion: FuncCompilerVersion) => void;
};

const _useCompilerSettingsStore = create(
  immer<State & DerivedState & Actions>((set, get) => ({
    // State
    compiler: "func" as Compiler,
    compilerSettings: { funcVersion: "", commandLine: "" } as UserProvidedFuncCompileSettings,
    _defaultFuncVersion: "",

    // Derived

    // Actions
    initialize: (defaultFuncVersion: FuncCompilerVersion) => {
      set((state) => {
        state._defaultFuncVersion = defaultFuncVersion;

        // TODO resolve this duplicity of logic with setCompiler
        state.compilerSettings = {
          funcVersion: state._defaultFuncVersion,
          commandLine: "",
          overrideCommandLine: null,
        };
      });
    },

    setCompilerSettings: (
      settings: UserProvidedFuncCompileSettings | UserProvidedTactCompileSettings,
    ) => {
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

    setFuncCliVersion: (funcVersion: FuncCompilerVersion) => {
      set((state) => {
        if (state.compiler !== "func") {
          throw new Error("not func compiler");
        }
        (state.compilerSettings as UserProvidedFuncCompileSettings).funcVersion = funcVersion;
      });
    },

    setTactCliVersion: (tactVersion: TactVersion) => {
      set((state) => {
        if (state.compiler !== "tact") {
          throw new Error("not tact compiler");
        }
        state.compilerSettings = { tactVersion };
      });
    },

    setCompiler: (compiler: Compiler) => {
      set((state) => {
        state.compiler = compiler;
        if (compiler === "func") {
          state.compilerSettings = {
            funcVersion: state._defaultFuncVersion,
            commandLine: "",
            overrideCommandLine: null,
          };
        } else if (compiler === "tact") {
          state.compilerSettings = { tactVersion: "" };
        }
      });
    },
  })),
);

export function useCompilerSettingsStore() {
  const { files, setInclueInCommand } = useFileStore();
  const compilerStore = _useCompilerSettingsStore();
  const {
    data: { tactVersions },
  } = useRemoteConfig();

  function prepareCommandLine() {
    const cmd = files
      .filter((f) => f.includeInCommand)
      .map((f) => (f.folder ? f.folder + "/" : "") + f.fileObj.name)
      .join(" ");

    if (!files) return "";
    return `-SPA ${cmd}`;
  }

  // Tact version setter
  useEffect(() => {
    const file = files.find((f) => f.fileObj.name.endsWith(".pkg"));
    (async () => {
      if (!file) return;
      const raw = await file.fileObj.text();
      const pkgParsed: PackageFileFormat = JSON.parse(raw);
      compilerStore.setCompiler("tact");
      // TODO show in UI
      if (!tactVersions.includes(pkgParsed.compiler.version)) {
        throw new Error("Unsupported tact version " + pkgParsed.compiler.version);
      }
      compilerStore.setCompilerSettings({ tactVersion: pkgParsed.compiler.version });
    })();
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
