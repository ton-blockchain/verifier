import "../App.css";
import { TopBar } from "../components/TopBar";
import {
  getMissingOnchainProofs,
  hasAnyOnchainProof,
  useLoadContractProof,
  getFirstAvailableProof,
} from "../lib/useLoadContractProof";
import ContractSourceCode from "../components/ContractSourceCode";
import { useOverride } from "../lib/useOverride";
import { useFileStore } from "../lib/useFileStore";
import { Backdrop, Box, Skeleton, useMediaQuery, useTheme } from "@mui/material";
import { useContractAddress } from "../lib/useContractAddress";
import React, { useEffect, useRef, useState } from "react";
import { ContractBlock } from "../components/ContractBlock";
import { CompilerBlock } from "../components/CompilerBlock";
import { AddSourcesBlock } from "../components/AddSourcesBlock";
import { PublishProof } from "../components/PublishProof";
import { Footer } from "../components/Footer";
import { CenteringWrapper } from "../components/Footer.styled";
import { AppNotification, NotificationType } from "../components/AppNotification";
import { NotificationTitle } from "../components/CompileOutput";
import { VerificationInfoBlock } from "../components/VerificationInfoBlock";
import { CenteringBox } from "../components/Common.styled";
import { useAddressHistory } from "../lib/useAddressHistory";
import { TestnetBar, useIsTestnet } from "../components/TestnetBar";
import { useRemoteConfig } from "../lib/useRemoteConfig";
import { useCompilerSettingsStore } from "../lib/useCompilerSettingsStore";
import { useCustomGetter } from "../lib/getter/useCustomGetter";
import { usePublishStore } from "../lib/usePublishSteps";
import { usePreload } from "../lib/usePreload";
import { ContentBox, ContractDataBox, OverflowingBox } from "../components/Layout";
import { useLoadVerifierRegistryInfo } from "../lib/useLoadVerifierRegistryInfo";
import { clearSubmitSourcesStore } from "../lib/useSubmitSources";
import { SkeletonBox } from "../components/SkeletonBox";
import { useLoadContractInfo } from "../lib/useLoadContractInfo";
import { InBrowserVerificationGuide } from "../components/VerificationGuides";

function ContractPage() {
  const theme = useTheme();
  const canOverride = useOverride();
  const { contractAddress } = useContractAddress();
  const {
    data: contractData,
    isLoading: contractIsLoading,
    error: contractIsError,
  } = useLoadContractInfo();
  const { isLoading: proofIsLoading, data: proofData, error } = useLoadContractProof();
  const { hasFiles, reset: resetFileStore } = useFileStore();
  const { reset: resetPublishStore } = usePublishStore();
  const { isPreloaded, clearPreloaded } = usePreload();
  const scrollToRef = useRef();
  const headerSpacings = useMediaQuery(theme.breakpoints.down("lg"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isTestnet = useIsTestnet();
  const isInvalidAddress = contractAddress === null;

  useAddressHistory();

  useEffect(() => {
    if (!isPreloaded) {
      resetFileStore();
    } else {
      clearPreloaded();
    }
    resetPublishStore();
    clearSubmitSourcesStore();
  }, [contractAddress]);

  const { clear: clearCustomGetter } = useCustomGetter();
  useEffect(() => {
    clearCustomGetter();
  }, [contractAddress]);

  useEffect(() => {
    window.scrollTo({ behavior: "auto", top: scrollToRef.current?.["offsetTop"] });
  }, [window.location.pathname]);

  const { initialize } = useCompilerSettingsStore();
  const { data: remoteConfig } = useRemoteConfig();
  const funcVersions = remoteConfig?.funcVersions ?? [];
  const tolkVersions = remoteConfig?.tolkVersions ?? [];
  useEffect(() => {
    if ((funcVersions?.length ?? 0) > 0) {
      initialize(funcVersions?.[0], tolkVersions?.[0]);
    }
  }, [funcVersions, tolkVersions]);

  const proofsLoaded = proofData !== undefined;
  const { data: verifierRegistry } = useLoadVerifierRegistryInfo();

  const anyOnchainProof = hasAnyOnchainProof(proofData);
  const missingProofs = getMissingOnchainProofs(proofData, verifierRegistry);
  const availableProof = getFirstAvailableProof(proofData);

  return (
    <Box>
      <Box ref={scrollToRef} />
      {isTestnet && <TestnetBar />}
      <TopBar />
      {isInvalidAddress && (
        <Box m={4}>
          <AppNotification
            singleLine
            type={NotificationType.ERROR}
            title={
              <CenteringBox sx={{ height: 42 }}>
                <span style={{ color: "#FC5656", marginRight: 4 }}>Error: </span>
                Invalid address
              </CenteringBox>
            }
            notificationBody={<Box />}
          />
        </Box>
      )}
      <ContentBox px={headerSpacings ? "20px" : 0}>
        {!!error && (
          <Box mt={4}>
            <AppNotification
              type={NotificationType.ERROR}
              title={
                <NotificationTitle>
                  <span style={{ color: "#FC5656" }}>Error: </span>
                  Unable to fetch contract data
                </NotificationTitle>
              }
              notificationBody={
                <Box sx={{ overflow: "auto", maxHeight: 300 }}>
                  <pre>
                    <code>{error.toString()}</code>
                  </pre>
                </Box>
              }
            />
          </Box>
        )}
        <ContractDataBox isMobile={isSmallScreen}>
          <ContractBlock />
          {!proofIsLoading && anyOnchainProof && <VerificationInfoBlock />}
        </ContractDataBox>
        {proofIsLoading || contractIsLoading ? (
          <SkeletonBox content />
        ) : (
          contractData && <CompilerBlock />
        )}
        {anyOnchainProof && <InBrowserVerificationGuide />}
        {contractAddress && proofsLoaded && (missingProofs.length > 0 || canOverride) && (
          <>
            <AddSourcesBlock
              contractAddress={contractAddress}
              missingVerifiers={missingProofs}
              availableProof={availableProof}
            />
            {hasFiles() && (
              <PublishProof missingProofs={missingProofs} contractAddress={contractAddress} />
            )}
          </>
        )}
        {proofsLoaded && !hasFiles() && (
          <OverflowingBox sx={{ padding: 0 }} mb={5}>
            <ContractSourceCode />
          </OverflowingBox>
        )}
        {proofsLoaded && <Footer />}
      </ContentBox>
      {!proofsLoaded && (
        <CenteringWrapper sx={{ bottom: 0, width: "100%" }}>
          <Footer />
        </CenteringWrapper>
      )}
    </Box>
  );
}

export default ContractPage;
