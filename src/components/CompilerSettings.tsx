import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  FuncVersion,
  useCompilerSettingsStore,
} from "../lib/useCompilerSettingsStore";

function CompilerSettings() {
  const compilerSettings = useCompilerSettingsStore();
  return (
    <div>
      <h3>Compiler</h3>
      <div style={{ display: "flex" }}>
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
            onChange={(e) => {
              compilerSettings.setVersion(e.target.value as FuncVersion);
            }}
          >
            <MenuItem value={"0.0.9"}>0.0.9</MenuItem>
            <MenuItem value={"0.1.0"}>0.1.0</MenuItem>
            <MenuItem value={"0.2.0"}>0.2.0</MenuItem>
          </Select>
        </FormControl>
        <TextField
          sx={{ flexGrow: 6 }}
          disabled
          variant="outlined"
          value={compilerSettings.commandLine}
        />
      </div>
    </div>
  );
}

export default CompilerSettings;
