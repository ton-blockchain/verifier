import { Chip, MenuItem, Typography } from "@mui/material";
import { FuncCliCompilerVersion, useCompilerSettingsStore } from "../lib/useCompilerSettingsStore";
import { Box } from "@mui/system";
import { CenteringBox } from "./common.styled";
import {
  DirectoryInput,
  CompilerFormControl,
  CompilerLabel,
  CompilerSelect,
} from "./compilerSetting.styled";
import { Cancel, Edit } from "@mui/icons-material";

function CompilerSettings() {
  const { compilerSettings, setOverrideCommandLine, setFuncCliVersion, compiler } =
    useCompilerSettingsStore();
  return (
    <div>
      <Typography variant="h5" style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>
        Compiler
      </Typography>
      <CenteringBox sx={{ gap: 1, alignItems: "flex-end" }}>
        <CenteringBox>
          <CompilerFormControl>
            <CompilerLabel>Compiler</CompilerLabel>
            <CompilerSelect disabled value={compiler}>
              <MenuItem value={"func"}>func</MenuItem>
            </CompilerSelect>
          </CompilerFormControl>
        </CenteringBox>
        {compiler === "func" && (
          <>
            <CenteringBox>
              <CompilerFormControl>
                <CompilerLabel>Version</CompilerLabel>
                <CompilerSelect
                  value={compilerSettings.funcVersion}
                  onChange={(e) => {
                    setFuncCliVersion(e.target.value as FuncCliCompilerVersion);
                  }}>
                  <MenuItem value={"0.2.0"}>0.2.0</MenuItem>
                  <MenuItem value={"0.3.0"}>0.3.0</MenuItem>
                </CompilerSelect>
              </CompilerFormControl>
            </CenteringBox>
            <Box sx={{ width: "100%", position: "relative" }}>
              <CompilerLabel sx={{ display: "block" }}>Func command</CompilerLabel>
              <DirectoryInput
                disabled={!compilerSettings.overrideCommandLine}
                value={compilerSettings.commandLine}
                onChange={(e) => {
                  setOverrideCommandLine(e.target.value);
                }}
              />
              <Chip sx={{ position: "absolute", left: 5, top: 31 }} label="func -o tmp.fif" />
              {!compilerSettings.overrideCommandLine && (
                <Edit
                  sx={{ color: "blue", position: "absolute", right: 10, top: 34 }}
                  onClick={() => {
                    setOverrideCommandLine(compilerSettings.commandLine ?? null);
                  }}
                />
              )}
              {!!compilerSettings.overrideCommandLine && (
                <Cancel
                  sx={{ color: "blue", position: "absolute", right: 10, top: 34 }}
                  onClick={() => {
                    setOverrideCommandLine(null);
                  }}
                />
              )}
            </Box>
          </>
        )}
      </CenteringBox>
    </div>
  );
}

export default CompilerSettings;
