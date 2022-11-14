import { FormControl, InputLabel, Select, MenuItem, TextField, Chip } from "@mui/material";
import {
  FuncCliCompilerVersion,
  useCompilerSettingsStore,
  NpmTonCompilerVersion,
  Compiler,
} from "../lib/useCompilerSettingsStore";

import { Edit, Cancel } from "@mui/icons-material";
import { UserProvidedNpmTonCompilerSettings } from "../lib/useCompilerSettingsStore";

function CliTonCompilerSettings() {
  const { compilerSettings, setOverrideCommandLine, setFuncCliVersion } =
    useCompilerSettingsStore();

  return (
    <>
      <FormControl sx={{ flexGrow: 1 }}>
        <InputLabel>Version</InputLabel>
        <Select
          value={compilerSettings.funcVersion}
          label="Version"
          onChange={(e) => {
            setFuncCliVersion(e.target.value as FuncCliCompilerVersion);
          }}>
          <MenuItem value={"0.2.0"}>0.2.0</MenuItem>
          <MenuItem value={"0.3.0"}>0.3.0</MenuItem>
        </Select>
      </FormControl>
      <div
        style={{
          backgroundColor: !!compilerSettings.overrideCommandLine ? "white" : "#efefef",
          border: "1px solid #aeaeae",
          padding: 10,
          flexGrow: 6,
          display: "flex",
          gap: 4,
        }}>
        <Chip label="func -o tmp.fif" />
        <input
          style={{
            border: "none",
            width: "100%",
            fontSize: 14,
            background: "transparent",
          }}
          disabled={!compilerSettings.overrideCommandLine}
          value={compilerSettings.commandLine}
          onChange={(e) => {
            setOverrideCommandLine(e.target.value);
          }}
        />
      </div>
      {!compilerSettings.overrideCommandLine && (
        <Edit
          sx={{ color: "blue" }}
          onClick={() => {
            setOverrideCommandLine(compilerSettings.commandLine ?? null);
          }}
        />
      )}
      {!!compilerSettings.overrideCommandLine && (
        <Cancel
          sx={{ color: "blue" }}
          onClick={() => {
            setOverrideCommandLine(null);
          }}
        />
      )}
    </>
  );
}

function NpmTonCompilerSettings() {
  const { compilerSettings, setNpmTonCompilerVersion } = useCompilerSettingsStore();

  return (
    <>
      <FormControl sx={{ flexGrow: 1 }}>
        <InputLabel>Version</InputLabel>
        <Select
          disabled
          value={(compilerSettings as UserProvidedNpmTonCompilerSettings).version}
          label="Version"
          onChange={(e) => {
            setNpmTonCompilerVersion(e.target.value as NpmTonCompilerVersion);
          }}>
          <MenuItem value={"v2022.10"}>v2022.10</MenuItem>
        </Select>
      </FormControl>
    </>
  );
}

function CompilerSettings() {
  const { compiler, setCompiler } = useCompilerSettingsStore();

  return (
    <div>
      <h4>Compiler</h4>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
        <FormControl sx={{ flexGrow: 1 }}>
          <InputLabel>Compiler</InputLabel>
          <Select
            onChange={(e) => setCompiler(e.target.value as Compiler)}
            value={compiler}
            label="Compiler">
            <MenuItem value={"cli:func"}>cli:func</MenuItem>
            <MenuItem value={"npm:ton-compiler"}>npm:ton-compiler</MenuItem>
          </Select>
        </FormControl>
        {compiler === "cli:func" && <CliTonCompilerSettings />}
        {compiler === "npm:ton-compiler" && <NpmTonCompilerSettings />}
      </div>
    </div>
  );
}

export default CompilerSettings;
