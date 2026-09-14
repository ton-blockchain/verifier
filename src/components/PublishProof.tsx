import { usePublishProof } from "../lib/usePublishProof";
import Button from "./Button";
import { CenteringBox, DataBox, IconBox, TitleText } from "./Common.styled";
import React, { useEffect, useMemo, useState } from "react";
import publish from "../assets/publish.svg";
import verified from "../assets/verified-bold.svg";
import { AppNotification, NotificationType } from "./AppNotification";
import { Box, styled } from "@mui/system";
import { NotificationTitle } from "./CompileOutput";
import { useSubmitSourcesEntries } from "../lib/useSubmitSources";
import { SECTIONS, STEPS, usePublishStore } from "../lib/usePublishSteps";
import { Checkbox, CircularProgress, Fade } from "@mui/material";
import { AppButton } from "./AppButton";
import { VerifierWithId } from "../lib/wrappers/verifier-registry";

const VerifierRow = styled(CenteringBox)({
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
  alignItems: "flex-start",
});

const VerifierInfo = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

const VerifierStatus = styled("span")({
  fontSize: 12,
  color: "#727272",
});

type PublishProofProps = {
  contractAddress: string;
  missingProofs: VerifierWithId[];
};

export function PublishProof({ contractAddress, missingProofs }: PublishProofProps) {
  const { sendProofs, status, clearTXN } = usePublishProof();
  const { step, toggleSection, currentSection } = usePublishStore();
  const entries = useSubmitSourcesEntries(contractAddress);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  let text: React.ReactNode;

  const onSectionExpand = () =>
    step === STEPS.PUBLISH && missingProofs.length > 0 && toggleSection(SECTIONS.PUBLISH);

  switch (status) {
    case "initial":
      text = (
        <span>
          To store your contract’s verification proof on-chain, you will need to issue a
          transaction. This will cost 0.5 TON
        </span>
      );
      break;
    case "rejected":
      text = "Transaction rejected, please retry.";
      break;
    case "pending":
      text = "Check your wallet for a pending transaction.";
      break;
    case "issued":
      text = "Transaction issued, monitoring proof deployment on-chain.";
      break;
    case "success":
      text = "Your contract is now verified! Click below to view it.";
      break;
    case "expired":
      text = "Transaction expired, please retry.";
      break;
    case "error":
      text =
        "The transaction is taking too long to complete or have failed. Please use a blockchain explorer to monitor it. You can also use our telegram support group.";
  }

  useEffect(() => {
    setSelected((prev) => {
      const next: Record<string, boolean> = {};
      missingProofs.forEach((verifier) => {
        const ready = !!entries[verifier.name]?.data?.result?.msgCell;
        if (ready) {
          next[verifier.name] = prev[verifier.name] ?? true;
        } else {
          next[verifier.name] = false;
        }
      });
      return next;
    });
  }, [missingProofs, entries]);

  const readySelection = useMemo(
    () =>
      missingProofs.filter(
        (verifier) => selected[verifier.name] && !!entries[verifier.name]?.data?.result?.msgCell,
      ),
    [missingProofs, selected, entries],
  );

  const canPublish = readySelection.length > 0;

  const toggleVerifier = (verifierName: string, checked: boolean) => {
    setSelected((prev) => ({ ...prev, [verifierName]: checked }));
  };

  const selectAllReady = () => {
    setSelected((prev) => {
      const next = { ...prev };
      missingProofs.forEach((verifier) => {
        const ready = !!entries[verifier.name]?.data?.result?.msgCell;
        next[verifier.name] = ready;
      });
      return next;
    });
  };

  const buildStatus = (verifierName: string) => {
    const entry = entries[verifierName];
    if (!entry) return "Waiting for compilation";
    if (entry.error) return entry.error.message;
    if (entry.isLoading || entry.status === "pending") {
      return entry.compileStatus ?? "Compiling...";
    }
    if (entry.data?.result?.msgCell) {
      return entry.compileStatus ?? "Ready to publish";
    }
    if (entry.compileStatus) {
      return entry.compileStatus;
    }
    if (entry.data) {
      return "Compilation finished";
    }
    return "Waiting for compilation";
  };

  const handlePublish = () => {
    const payloads = readySelection
      .map((verifier) => {
        const msgCell = entries[verifier.name]?.data?.result?.msgCell;
        if (!msgCell) return null;
        return { verifier: verifier.name, msgCell };
      })
      .filter(Boolean) as { verifier: string; msgCell: Buffer }[];

    sendProofs(payloads);
  };

  const disableSelection = ["pending", "issued"].includes(status);

  return (
    <DataBox mb={6}>
      <CenteringBox
        p={currentSection === SECTIONS.PUBLISH ? "30px 24px 0 24px" : "20px 24px"}
        onClick={onSectionExpand}
        sx={{
          opacity: step === STEPS.PUBLISH && missingProofs.length > 0 ? 1 : 0.25,
          cursor: step === STEPS.PUBLISH && missingProofs.length > 0 ? "pointer" : "inherit",
        }}>
        <IconBox>
          <img
            src={status === "success" ? verified : publish}
            alt="publish icon"
            width={41}
            height={41}
          />
        </IconBox>
        <TitleText>Publish</TitleText>
      </CenteringBox>
      {currentSection === SECTIONS.PUBLISH && missingProofs.length > 0 && (
        <Fade in={currentSection === SECTIONS.PUBLISH}>
          <Box>
            <Box sx={{ padding: "0 30px" }}>
              <AppNotification
                type={NotificationType.INFO}
                title={<></>}
                notificationBody={
                  <CenteringBox sx={{ overflow: "auto", maxHeight: 300 }}>
                    <NotificationTitle sx={{ marginBottom: 0 }}>{text}</NotificationTitle>
                  </CenteringBox>
                }
              />
            </Box>
            <Box sx={{ padding: "10px 30px 0 30px" }}>
              {missingProofs.length === 0 && (
                <VerifierStatus>All available proofs are already published.</VerifierStatus>
              )}
              {missingProofs.length > 0 && (
                <>
                  <CenteringBox sx={{ justifyContent: "flex-end", mb: 1 }}>
                    <AppButton
                      fontSize={12}
                      fontWeight={600}
                      textColor="#000"
                      height={30}
                      width={150}
                      background="#fff"
                      hoverBackground="#F5F5F5"
                      onClick={selectAllReady}
                      disabled={disableSelection}>
                      Select all ready
                    </AppButton>
                  </CenteringBox>
                  {/*NOTE: hide orbs*/}
                  {[...missingProofs].slice(1).map((verifier) => {
                    const ready = !!entries[verifier.name]?.data?.result?.msgCell;
                    return (
                      <VerifierRow key={verifier.id} sx={{ justifyContent: "flex-start" }}>
                        <Checkbox
                          disabled={!ready || disableSelection}
                          checked={!!selected[verifier.name] && ready}
                          onChange={(e) => toggleVerifier(verifier.name, e.target.checked)}
                        />
                        <VerifierInfo>
                          <span style={{ fontWeight: 600 }}>{verifier.name}</span>
                          <VerifierStatus>{buildStatus(verifier.name)}</VerifierStatus>
                        </VerifierInfo>
                      </VerifierRow>
                    );
                  })}
                </>
              )}
            </Box>
            <CenteringBox mb={3} mt={3} sx={{ justifyContent: "center" }}>
              {status !== "success" && (
                <AppButton
                  disabled={status === "pending" || status === "issued" || !canPublish}
                  fontSize={14}
                  fontWeight={800}
                  textColor="#fff"
                  height={44}
                  width={144}
                  background="#1976d2"
                  hoverBackground="#156cc2"
                  onClick={handlePublish}>
                  {(status === "pending" || status === "issued") && (
                    <CircularProgress
                      sx={{ color: "#fff", height: "20px !important", width: "20px !important" }}
                    />
                  )}
                  Publish
                </AppButton>
              )}
              {status === "success" && (
                <Button
                  sx={{ height: 44 }}
                  text="View verified contract"
                  onClick={() => {
                    location.reload();
                  }}
                />
              )}
            </CenteringBox>
          </Box>
        </Fade>
      )}
    </DataBox>
  );
}
