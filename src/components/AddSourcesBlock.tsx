import React from "react";
import { CenteringBox, DataBox } from "./common.styled";
import { useFileStore } from "../lib/useFileStore";
import { useSubmitSources } from "../lib/useSubmitSources";
import { FileUploaderArea } from "./FileUploaderArea";
import { FileTable } from "./FileTable";
import CompilerSettings from "./CompilerSettings";
import { CompileOutput } from "./CompileOutput";
import { Box, styled } from "@mui/system";
import { AppButton } from "./AppButton";
import { useWalletConnect } from "../lib/useWalletConnect";
import WalletConnect from "./WalletConnect";
import { STEPS, usePublishStore } from "../lib/usePublishSteps";
import { Fade } from "@mui/material";

const ContentBox = styled(Box)({
  padding: "15px 30px",
});

export function AddSourcesBlock() {
  const { walletAddress } = useWalletConnect();
  const { hasFiles } = useFileStore();
  const { step, proceedToPublish } = usePublishStore();
  const { mutate, data, error, isLoading } = useSubmitSources();

  return (
    <DataBox>
      <FileUploaderArea />
      {step !== STEPS.PUBLISH && (
        <Fade in={step !== STEPS.PUBLISH}>
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
                <CenteringBox sx={{ justifyContent: "center" }} my={3}>
                  {!walletAddress ? (
                    <WalletConnect />
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
                      {isLoading ? "Submitting..." : `Compile`}
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
