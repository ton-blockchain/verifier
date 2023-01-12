import "./App.css";
import { TopBar } from "./components/TopBar";
import { useLoadContractProof } from "./lib/useLoadContractProof";
import ContractSourceCode from "./components/ContractSourceCode";
import { useOverride } from "./lib/useOverride";
import { useFileStore } from "./lib/useFileStore";
import { useResetState } from "./lib/useResetState";
import { styled } from "@mui/system";
import { Backdrop, Box, Skeleton, useMediaQuery, useTheme } from "@mui/material";
import { useContractAddress } from "./lib/useContractAddress";
import React, { useEffect, useRef, useState } from "react";
import { ContractBlock } from "./components/ContractBlock";
import { CompilerBlock } from "./components/CompilerBlock";
import { AddSourcesBlock } from "./components/AddSourcesBlock";
import { PublishProof } from "./components/PublishProof";
import { Footer } from "./components/Footer";
import { CenteringWrapper } from "./components/Footer.styled";
import { AppNotification, NotificationType } from "./components/AppNotification";
import { NotificationTitle } from "./components/CompileOutput";
import { VerificationInfoBlock } from "./components/VerificationInfoBlock";
import { CenteringBox } from "./components/Common.styled";
import { useAddressHistory } from "./lib/useAddressHistory";
import { useWalletConnect } from "./lib/useWalletConnect";
import { LatestVerifiedContracts } from "./components/LatestVerifiedContracts";

const ContentBox = styled(Box)({
  maxWidth: 1160,
  margin: "auto",
});

interface ContractDataBoxProps {
  isMobile?: boolean;
}

const ContractDataBox = styled(Box)((props: ContractDataBoxProps) => ({
  display: props.isMobile ? "inherit" : "flex",
  gap: 20,
}));

const OverflowingBox = styled(Box)({
  boxSizing: "border-box",
  maxWidth: 1160,
  width: "100%",
  marginTop: 20,
  backgroundColor: "#fff",
  borderRadius: 20,
  padding: 20,
  color: "#000",
});

const generateErrorMessage = (error: string, address: string) => {
  if (error === "TypeError: Cannot read properties of null (reading 'length')") {
    return "No contract deployed at address " + address;
  }
  return error;
};

function App() {
  const { isLoading, data: proofData, error } = useLoadContractProof();
  const [isDragging, setIsDragging] = useState(false);
  const theme = useTheme();
  const canOverride = useOverride();
  const { contractAddress, isAddressEmpty } = useContractAddress();
  const { hasFiles } = useFileStore();
  const scrollToRef = useRef();
  const headerSpacings = useMediaQuery(theme.breakpoints.down("lg"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const showSkeleton = !error && isLoading && contractAddress;
  const { restoreConnection } = useWalletConnect();

  useEffect(() => {
    restoreConnection();
  }, []);

  useAddressHistory();
  useResetState();

  useEffect(() => {
    window.scrollTo({ behavior: "auto", top: scrollToRef.current?.["offsetTop"] });
  }, [window.location.pathname]);

  return (
    <Box
      onDragEnter={() => setIsDragging(true)}
      onDrop={() => setIsDragging(false)}
      onClick={() => setIsDragging(false)}>
      <Backdrop
        sx={{ color: "#fff", zIndex: 4 }}
        open={isDragging}
        onDragEnd={() => setIsDragging(false)}
      />
      <Box ref={scrollToRef} />
      <TopBar />
      {contractAddress === null && isAddressEmpty && <LatestVerifiedContracts />}
      {contractAddress === null && !isAddressEmpty && (
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
                    <code>{generateErrorMessage(error.toString(), contractAddress || "")}</code>
                  </pre>
                </Box>
              }
            />
          </Box>
        )}
        {showSkeleton && (
          <OverflowingBox sx={{ padding: "30px 24px 24px 24px" }} mb={3}>
            <CenteringBox mb={3}>
              <Skeleton variant="circular" width={41} height={41} sx={{ marginRight: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: "20px", width: 200 }} />
            </CenteringBox>
            <Skeleton variant="rectangular" width="100%" height={250} />
          </OverflowingBox>
        )}

        {!isLoading && (
          <ContractDataBox isMobile={isSmallScreen}>
            <ContractBlock />
            {proofData?.hasOnchainProof && <CompilerBlock />}
          </ContractDataBox>
        )}
        {showSkeleton && (
          <OverflowingBox sx={{ padding: "30px 24px 24px 24px" }} mb={3}>
            <CenteringBox mb={3}>
              <Skeleton variant="circular" width={41} height={41} sx={{ marginRight: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: "20px", width: 200 }} />
            </CenteringBox>
            <Skeleton variant="rectangular" width="100%" height={250} />
          </OverflowingBox>
        )}
        {!isLoading && proofData?.hasOnchainProof && <VerificationInfoBlock />}
        {proofData && (!proofData.hasOnchainProof || canOverride) && (
          <>
            <AddSourcesBlock />
            {hasFiles() && <PublishProof />}
          </>
        )}
        {proofData && !hasFiles() ? (
          <OverflowingBox sx={{ padding: 0 }} mb={5}>
            <ContractSourceCode />
          </OverflowingBox>
        ) : (
          <>
            {showSkeleton && (
              <OverflowingBox sx={{ padding: "30px 24px 24px 24px" }} mb={5}>
                <CenteringBox mb={3}>
                  <Skeleton variant="circular" width={41} height={41} sx={{ marginRight: 2 }} />
                  <Skeleton variant="text" sx={{ fontSize: "20px", width: 250 }} />
                </CenteringBox>
                <Skeleton variant="rectangular" width="100%" height={500} />
              </OverflowingBox>
            )}
          </>
        )}
        {proofData && <Footer />}
      </ContentBox>
      {!proofData && (
        <CenteringWrapper sx={{ bottom: 0, width: "100%" }}>
          <Footer />
        </CenteringWrapper>
      )}
    </Box>
  );
}

export default App;
