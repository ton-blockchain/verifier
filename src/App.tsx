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
import { useNavigate } from "react-router-dom";

const AppBox = styled(Box)({});

const ContentBox = styled(Box)({
  position: "relative",
  maxWidth: 1160,
  width: "100%",
  margin: "auto",
});

const PositionedContent = styled(Box)({
  position: "absolute",
  width: "100%",
  top: -141,
  left: 0,
});

const ContractDataBox = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
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
    <AppBox
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
        {!!error && <Box sx={{ marginTop: 4 }}>Error {`${error}`}</Box>}
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
            <OverflowingBox mb={5}>
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
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "calc(50% - 400px)",
          marginTop: 20,
          display: "flex",
          gap: 10,
          background: "white",
          borderRadius: 20,
          padding: "10px 20px",
          width: 800,
          zIndex: 99,
          margin: "auto",
        }}></div>
    </AppBox>
  );
}

export default App;
