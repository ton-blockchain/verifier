import { useEffect } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useFileStore } from "./useFileStore";
import { FuncCompilerVersion, TactVersion, TolkVersion } from "../types/compiler";
import { PackageFileFormat } from "@tact-lang/compiler";
import { useRemoteConfig } from "./useRemoteConfig";

export type Compiler = "func" | "fift" | "tact" | "tolk";

export type UserProvidedFuncCompileSettings = {
  funcVersion: FuncCompilerVersion;
  commandLine: string;
  overrideCommandLine: string | null;
};

export type UserProvidedTactCompileSettings = {
  tactVersion: TactVersion;
};

export type UserProvidedTolkCompilerSettings = {
  tolkVersion: TolkVersion;
};

type State = {
  compiler: Compiler;
  compilerSettings:
    | UserProvidedFuncCompileSettings
    | UserProvidedTactCompileSettings
    | UserProvidedTolkCompilerSettings;
  _defaultFuncVersion: FuncCompilerVersion;
  _defaultTolkVersion: TolkVersion;
};

type DerivedState = {};

type Actions = {
  setCompilerSettings: (
    settings:
      | UserProvidedFuncCompileSettings
      | UserProvidedTactCompileSettings
      | UserProvidedTolkCompilerSettings,
  ) => void;
  setOverrideCommandLine: (overrideCommandLine: string | null) => void;
  setFuncCliVersion: (funcVersion: FuncCompilerVersion) => void;
  setTactCliVersion: (tactVersion: TactVersion) => void;
  setTolkVersion: (tolkVersion: TolkVersion) => void;
  setCompiler: (compiler: Compiler) => void;
  initialize: (defaultFuncVersion: FuncCompilerVersion, defaultTolkVersion: TolkVersion) => void;
};

const _useCompilerSettingsStore = create(
  immer<State & DerivedState & Actions>((set, get) => ({
    // State
    compiler: "func" as Compiler,
    compilerSettings: { funcVersion: "", commandLine: "" } as UserProvidedFuncCompileSettings,
    _defaultFuncVersion: "",
    _defaultTolkVersion: "",

    // Derived

    // Actions
    initialize: (defaultFuncVersion: FuncCompilerVersion, defaultTolkVersion: TolkVersion) => {
      set((state) => {
        state._defaultFuncVersion = defaultFuncVersion;
        state._defaultTolkVersion = defaultTolkVersion;

        // TODO resolve this duplicity of logic with setCompiler
        state.compilerSettings = {
          funcVersion: state._defaultFuncVersion,
          commandLine: "",
          overrideCommandLine: null,
        };
      });
    },

    setCompilerSettings: (
      settings:
        | UserProvidedFuncCompileSettings
        | UserProvidedTactCompileSettings
        | UserProvidedTolkCompilerSettings,
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

    setTolkVersion: (tolkVersion: TolkVersion) => {
      set((state) => {
        if (state.compiler !== "tolk") {
          throw new Error("not tolk compiler");
        }
        state.compilerSettings = { tolkVersion };
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
        } else if (compiler === "tolk") {
          state.compilerSettings = {
            tolkVersion: state._defaultTolkVersion,
          };
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

  // Tact/Tolk version setter
  useEffect(() => {
    const tactPkgFile = files.find((f) => f.fileObj.name.endsWith(".pkg"));
    const tolkFile = files.find((f) => f.fileObj.name.endsWith(".tolk"));
    (async () => {
      if (tactPkgFile) {
        const raw = await tactPkgFile.fileObj.text();
        const pkgParsed: PackageFileFormat = JSON.parse(raw);
        compilerStore.setCompiler("tact");
        // TODO show in UI
        if (!tactVersions.includes(pkgParsed.compiler.version)) {
          throw new Error("Unsupported tact version " + pkgParsed.compiler.version);
        }
        compilerStore.setCompilerSettings({ tactVersion: pkgParsed.compiler.version });
      } else if (tolkFile) {
        compilerStore.setCompiler("tolk");
      }
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
