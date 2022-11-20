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

const ContentBox = styled(Box)({
  padding: "15px 30px",
});

export function AddSourcesBlock() {
  const { walletAddress } = useWalletConnect();
  const { hasFiles } = useFileStore();
  const { mutate, data, error, isLoading } = useSubmitSources();

  return (
    <DataBox>
      <FileUploaderArea />
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
              ) : (
                <AppButton
                  disabled={!hasFiles() || !!data?.result?.msgCell}
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
              )}
            </CenteringBox>
          )}
        </>
      </ContentBox>
    </DataBox>
  );
}
