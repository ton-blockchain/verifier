import { Chip, IconButton, MenuItem, Typography } from "@mui/material";
import { FuncCliCompilerVersion, useCompilerSettingsStore } from "../lib/useCompilerSettingsStore";
import { Box } from "@mui/system";
import { CenteringBox } from "./common.styled";
import {
  DirectoryInput,
  CompilerFormControl,
  CompilerLabel,
  CompilerSelect,
} from "./compilerSetting.styled";
import undo from "../assets/undo.svg";
import { useSubmitSources } from "../lib/useSubmitSources";
import { STEPS, usePublishStore } from "../lib/usePublishSteps";

function CompilerSettings() {
  const { compilerSettings, setOverrideCommandLine, setFuncCliVersion, compiler } =
    useCompilerSettingsStore();
  const { data } = useSubmitSources();
  const { step } = usePublishStore();

  const canPublish = !!data?.result?.msgCell;

  return (
    <Box mt={4}>
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
              <CompilerFormControl disabled={step === STEPS.PUBLISH && canPublish}>
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
                disabled={step === STEPS.PUBLISH && canPublish}
                value={compilerSettings.commandLine}
                onChange={(e) => {
                  setOverrideCommandLine(e.target.value);
                }}
              />
              <Chip
                sx={{
                  position: "absolute",
                  left: 3,
                  top: 28,
                  height: 37,
                  background: "#F5F5F5",
                  borderRadius: 1.5,
                  color: "#000",
                  fontSize: 14,
                }}
                label="func -o tmp.fif"
              />
              {!!compilerSettings.overrideCommandLine && (
                <IconButton
                  sx={{ color: "blue", position: "absolute", right: 10, top: 31 }}
                  onClick={() => {
                    setOverrideCommandLine(null);
                  }}>
                  <img src={undo} alt="Undo icon" width={15} height={15} />
                </IconButton>
              )}
            </Box>
          </>
        )}
      </CenteringBox>
    </Box>
  );
}

export default CompilerSettings;
