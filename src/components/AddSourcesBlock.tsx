import React from "react";
import { CenteringBox, DataBox } from "./Common.styled";
import { useFileStore } from "../lib/useFileStore";
import {
  DEFAULT_VERIFIER,
  useSubmitSources,
  useSubmitSourcesEntries,
} from "../lib/useSubmitSources";
import { FileUploaderArea } from "./FileUploaderArea";
import { FileTable } from "./FileTable";
import CompilerSettings from "./CompilerSettings";
import { CompileOutput } from "./CompileOutput";
import { Box, styled } from "@mui/system";
import { AppButton } from "./AppButton";
import { SECTIONS, STEPS, usePublishStore } from "../lib/usePublishSteps";
import { CircularProgress, Fade } from "@mui/material";
import { useTonAddress } from "@tonconnect/ui-react";
import ConnectButton from "./ConnectButton";
import { VerifierWithId } from "../lib/wrappers/verifier-registry";
import { ContractProofData } from "../lib/useLoadContractProof";
import { getValidSources } from "../lib/getSourcesData";

const ContentBox = styled(Box)({
  padding: "15px 24px",
});

const PrefillButtonWrapper = styled(Box)({
  position: "absolute",
  top: 12,
  right: 12,
  zIndex: 2,
});

type AddSourcesBlockProps = {
  contractAddress: string;
  missingVerifiers?: VerifierWithId[];
  availableProof?: ContractProofData;
};

export function AddSourcesBlock({
  contractAddress,
  missingVerifiers = [],
  availableProof,
}: AddSourcesBlockProps) {
  const walletAddress = useTonAddress();
  const { hasFiles, addFiles, reset: resetFiles } = useFileStore();
  const { step, proceedToPublish, toggleSection, currentSection } = usePublishStore();
  // NOTE: orbs is first
  const activeVerifierName =
    missingVerifiers.length === 2 ? missingVerifiers[1]?.name : DEFAULT_VERIFIER;
  const { mutate, data, error, isLoading } = useSubmitSources(contractAddress, activeVerifierName);
  const entries = useSubmitSourcesEntries(contractAddress);

  const readyPublishCount = missingVerifiers.length
    ? missingVerifiers.filter((verifier) => entries[verifier.name]?.data?.result?.msgCell).length
    : data?.result?.msgCell
      ? 1
      : 0;
  const canPublish = readyPublishCount > 0;

  const onSectionExpand = () => toggleSection(SECTIONS.SOURCES);

  const validFiles = getValidSources(availableProof?.files);
  const canPrefill = validFiles.length > 0;

  const handlePrefill = async () => {
    if (validFiles.length === 0) return;
    resetFiles();

    const generatedFiles = validFiles.map((file) => {
      const segments = file.name.split("/");
      const baseName = segments.pop() ?? file.name;
      const generated = new File([file.content], baseName, { type: "text/plain" });
      const normalizedPath = segments.length > 0 ? `${segments.join("/")}/${baseName}` : baseName;
      Object.defineProperty(generated, "path", {
        value: normalizedPath,
        configurable: true,
      });
      return generated;
    });

    await addFiles(generatedFiles);
  };

  const compileVerifiers =
    missingVerifiers.length > 0 ? missingVerifiers.map((verifier) => verifier.name) : undefined;

  return (
    <DataBox>
      <Box
        sx={{ cursor: step === STEPS.PUBLISH && canPublish ? "pointer" : "inherit" }}
        onClick={onSectionExpand}>
        <Box sx={{ position: "relative" }}>
          <FileUploaderArea />
          {canPrefill && (
            <PrefillButtonWrapper
              onClick={(event) => {
                event.stopPropagation();
              }}>
              <AppButton
                fontSize={12}
                fontWeight={600}
                textColor="#000"
                height={32}
                width={180}
                background="#fff"
                hoverBackground="#F5F5F5"
                onClick={handlePrefill}>
                Load verified sources
              </AppButton>
            </PrefillButtonWrapper>
          )}
        </Box>
      </Box>
      {currentSection === SECTIONS.SOURCES && (
        <Fade in={currentSection === SECTIONS.SOURCES}>
          <ContentBox>
            <>
              {hasFiles() && (
                <>
                  <FileTable canPublish={canPublish} />
                  <CompilerSettings canPublish={canPublish} />
                </>
              )}
              {(data || error) && (
                <CompileOutput contractAddress={contractAddress} verifier={activeVerifierName} />
              )}
              {hasFiles() && (
                <CenteringBox sx={{ justifyContent: "center" }} mt={3} mb="9px">
                  {!walletAddress ? (
                    <ConnectButton />
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
                        mutate(
                          compileVerifiers
                            ? {
                                verifiers: compileVerifiers,
                              }
                            : null,
                        );
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
