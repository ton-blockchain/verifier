import React from "react";
import { CenteringBox, DataBox } from "./Common.styled";
import { useFileStore } from "../lib/useFileStore";
import { useSubmitSources } from "../lib/useSubmitSources";
import { FileUploaderArea } from "./FileUploaderArea";
import { FileTable } from "./FileTable";
import CompilerSettings from "./CompilerSettings";
import { CompileOutput } from "./CompileOutput";
import { Box, styled } from "@mui/system";
import { AppButton } from "./AppButton";
import { SECTIONS, STEPS, usePublishStore } from "../lib/usePublishSteps";
import { CircularProgress, Fade } from "@mui/material";
import { useTonAddress } from "@tonconnect/ui-react";
import { StyledTonConnectButton } from "./TopBar";

const ContentBox = styled(Box)({
  padding: "15px 24px",
});

export function AddSourcesBlock() {
  const walletAddress = useTonAddress();
  const { hasFiles } = useFileStore();
  const { step, proceedToPublish, toggleSection, currentSection } = usePublishStore();
  const { mutate, data, error, isLoading, compileStatus } = useSubmitSources();

  const canPublish = !!data?.result?.msgCell;

  const onSectionExpand = () => toggleSection(SECTIONS.SOURCES);

  return (
    <DataBox>
      <Box
        sx={{ cursor: step === STEPS.PUBLISH && canPublish ? "pointer" : "inherit" }}
        onClick={onSectionExpand}>
        <FileUploaderArea />
      </Box>
      {currentSection === SECTIONS.SOURCES && (
        <Fade in={currentSection === SECTIONS.SOURCES}>
          <ContentBox>
            <>
              {hasFiles() && (
                <>
                  <FileTable />
                  <CompilerSettings />
                </>
              )}
              {(data || error) && <CompileOutput />}
              {hasFiles() && (
                <CenteringBox sx={{ justifyContent: "center" }} mt={3} mb="9px">
                  {!walletAddress ? (
                    <StyledTonConnectButton />
                  ) : !data?.result?.msgCell ? (
                    <AppButton
                      disabled={!hasFiles()}
                      fontSize={14}
                      fontWeight={800}
                      textColor="#fff"
                      height={44}
                      width={144}
                      background="#1976d2"
                      hoverBackground="#156cc2"
                      onClick={() => {
                        mutate(null);
                      }}>
                      {isLoading && (
                        <CircularProgress
                          sx={{
                            color: "#fff",
                            height: "20px !important",
                            width: "20px !important",
                          }}
                        />
                      )}
                      Compile
                    </AppButton>
                  ) : (
                    <AppButton
                      disabled={step === STEPS.PUBLISH}
                      fontSize={14}
                      fontWeight={800}
                      textColor="#fff"
                      height={44}
                      width={144}
                      background="#1976d2"
                      hoverBackground="#156cc2"
                      onClick={proceedToPublish}>
                      Ready to publish
                    </AppButton>
                  )}
                </CenteringBox>
              )}
            </>
          </ContentBox>
        </Fade>
      )}
    </DataBox>
  );
}
