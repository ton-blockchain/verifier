import { Chip, IconButton, MenuItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import {
  Compiler,
  FuncCliCompilerVersion,
  useCompilerSettingsStore,
} from "../lib/useCompilerSettingsStore";
import { Box } from "@mui/system";
import { CenteringBox } from "./Common.styled";
import {
  DirectoryInput,
  CompilerFormControl,
  CompilerLabel,
  CompilerSelect,
} from "./CompilerSetting.styled";
import undo from "../assets/undo.svg";
import { useSubmitSources } from "../lib/useSubmitSources";

function CompilerSettings() {
  const { compilerSettings, setOverrideCommandLine, setFuncCliVersion, compiler, setCompiler } =
    useCompilerSettingsStore();
  const { data } = useSubmitSources();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const canPublish = !!data?.result?.msgCell;

  return (
    <Box mt={4}>
      <Typography variant="h5" style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>
        Compiler
      </Typography>
      <CenteringBox
        sx={{
          gap: 1,
          alignItems: isSmallScreen ? "center" : "flex-end",
          flexDirection: isSmallScreen ? "column" : "inherit",
        }}>
        <CenteringBox mb={isSmallScreen ? 1 : 0} sx={{ width: isSmallScreen ? "100%" : "inherit" }}>
          <CompilerFormControl>
            <CompilerLabel>Compiler</CompilerLabel>
            <CompilerSelect
              value={compiler}
              onChange={(e) => {
                setCompiler(e.target.value as Compiler);
              }}>
              <MenuItem value={"func"}>func</MenuItem>
              <MenuItem value={"tact"}>tact</MenuItem>
              {import.meta.env.VITE_ALLOW_FIFT && <MenuItem value={"fift"}>fift</MenuItem>}
            </CompilerSelect>
          </CompilerFormControl>
        </CenteringBox>
        {compiler === "func" && (
          <>
            <CenteringBox
              mb={isSmallScreen ? 1 : 0}
              sx={{ width: isSmallScreen ? "100%" : "inherit" }}>
              <CompilerFormControl disabled={canPublish}>
                <CompilerLabel>Version</CompilerLabel>
                <CompilerSelect
                  value={compilerSettings.funcVersion}
                  onChange={(e) => {
                    setFuncCliVersion(e.target.value as FuncCliCompilerVersion);
                  }}>
                  <MenuItem value={"0.4.0"}>0.4.0</MenuItem>
                  <MenuItem value={"0.3.0"}>0.3.0</MenuItem>
                  <MenuItem value={"0.2.0"}>0.2.0</MenuItem>
                </CompilerSelect>
              </CompilerFormControl>
            </CenteringBox>
            <Box sx={{ width: "100%", position: "relative" }}>
              <CompilerLabel sx={{ display: "block" }}>Func command</CompilerLabel>
              <DirectoryInput
                disabled={canPublish}
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
