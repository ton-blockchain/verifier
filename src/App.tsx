import "./App.css";
import { TopBar } from "./components/TopBar";
import { useLoadContractProof } from "./lib/useLoadContractProof";
import ContractSourceCode from "./components/ContractSourceCode";
import { useOverride } from "./lib/useOverride";
import { useFileStore } from "./lib/useFileStore";
import { useResetState } from "./lib/useResetState";
import { styled } from "@mui/system";
import { Backdrop, Box } from "@mui/material";
import { useContractAddress } from "./lib/useContractAddress";
import React, { useEffect, useRef, useState } from "react";
import { ContractBlock } from "./components/ContractBlock";
import { CompilerBlock } from "./components/CompilerBlock";
import { AddSourcesBlock } from "./components/AddSourcesBlock";
import { PublishProof } from "./components/PublishProof";
import { Footer } from "./components/Footer";
import { CenteringWrapper } from "./components/footer.styled";
import { AppNotification, NotificationType } from "./components/AppNotification";
import { NotificationTitle } from "./components/CompileOutput";

const ContentBox = styled(Box)({
  position: "relative",
  maxWidth: 1160,
  width: "100%",
  margin: "auto",
});

const PositionedContent = styled(Box)({
  position: "absolute",
  width: "100%",
  top: -193,
  left: 0,
});

const ContractDataBox = styled(Box)({
  display: "flex",
  gap: 20,
});

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

function App() {
  const { isLoading, data: proofData, error } = useLoadContractProof();
  const [isDragging, setIsDragging] = useState(false);
  const canOverride = useOverride();
  const { isAddressValid } = useContractAddress();
  const { hasFiles } = useFileStore();
  const scrollToRef = useRef();

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
      <ContentBox>
        {!error && isLoading && isAddressValid && <Box sx={{ marginTop: 4 }}>Loading...</Box>}
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
        <PositionedContent>
          {!isLoading && (
            <ContractDataBox>
              <ContractBlock />
              {proofData && proofData.hasOnchainProof && <CompilerBlock />}
            </ContractDataBox>
          )}
          {proofData && (!proofData.hasOnchainProof || canOverride) && (
            <>
              <AddSourcesBlock />
              {hasFiles() && <PublishProof />}
            </>
          )}
          {proofData && !hasFiles() && (
            <OverflowingBox sx={{ padding: 0 }} mb={5}>
              <ContractSourceCode />
            </OverflowingBox>
          )}
          {proofData && <Footer />}
        </PositionedContent>
      </ContentBox>
      {!proofData && (
        <CenteringWrapper sx={{ position: "fixed", bottom: 0, width: "100%" }}>
          <Footer />
        </CenteringWrapper>
      )}
    </Box>
  );
}

export default App;
