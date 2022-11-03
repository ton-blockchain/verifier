import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
} from "@mui/material";
import {
  FuncVersion,
  useCompilerSettingsStore,
} from "../lib/useCompilerSettingsStore";

import { Edit, Cancel } from "@mui/icons-material";

function CompilerSettings() {
  const compilerSettings = useCompilerSettingsStore();
  return (
    <div>
      <h3>Compiler</h3>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <FormControl sx={{ flexGrow: 1 }}>
          <InputLabel>Compiler</InputLabel>
          <Select disabled value={compilerSettings.compiler} label="Compiler">
            <MenuItem value={"func"}>func</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ flexGrow: 1 }}>
          <InputLabel>Version</InputLabel>
          <Select
            value={compilerSettings.version}
            defaultValue="0.2.0"
            label="Version"
            disabled
            onChange={(e) => {
              compilerSettings.setVersion(e.target.value as FuncVersion);
            }}
          >
            <MenuItem value={"0.2.0"}>0.2.0</MenuItem>
          </Select>
        </FormControl>
        {/* <TextField
          sx={{ flexGrow: 6 }}
          disabled={!compilerSettings.overrideCommandLine}
          variant="outlined"
          value={compilerSettings.commandLine}
          onChange={(e) => {
            compilerSettings.setOverrideCommandLine(e.target.value);
          }}
          label="Command Line"
        >
          <div>hi</div>
        </TextField> */}
        <div
          style={{
            backgroundColor: !!compilerSettings.overrideCommandLine
              ? "white"
              : "#efefef",
            border: "1px solid #aeaeae",
            padding: 10,
            flexGrow: 6,
            display: "flex",
            gap: 4,
          }}
        >
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
              compilerSettings.setOverrideCommandLine(e.target.value);
            }}
          />
        </div>
        {!compilerSettings.overrideCommandLine && (
          <Edit
            sx={{ color: "blue" }}
            onClick={() => {
              compilerSettings.setOverrideCommandLine(
                compilerSettings.commandLine
              );
            }}
          />
        )}
        {!!compilerSettings.overrideCommandLine && (
          <Cancel
            sx={{ color: "blue" }}
            onClick={() => {
              compilerSettings.setOverrideCommandLine(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default CompilerSettings;
