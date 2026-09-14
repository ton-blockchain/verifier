import "./ContractSourceCode.css";
import { Box, Tabs, Tab, IconButton, useMediaQuery } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { VerifiedSourceCode } from "./VerifiedSourceCode";
import { DisassembledSourceCode } from "./DisassembledSourceCode";
import { CenteringBox, IconBox, TitleBox, TitleText } from "./Common.styled";
import verified from "../assets/verified-light.svg";
import { styled } from "@mui/system";
import download from "../assets/download.svg";
import { AppButton } from "./AppButton";
import copy from "../assets/copy.svg";
import { downloadSources } from "../lib/downloadSources";
import useNotification from "../lib/useNotification";
import { Getters } from "./Getters";
import { useLoadVerifierRegistryInfo } from "../lib/useLoadVerifierRegistryInfo";
import { useContractAddress } from "../lib/useContractAddress";
import { useSyncGetters } from "../lib/getter/useGetters";
import { ContractProofData, useLoadContractProof } from "../lib/useLoadContractProof";
import { getValidSources } from "../lib/getSourcesData";

const TitleWrapper = styled(CenteringBox)({
  justifyContent: "space-between",
  width: "100%",
});

const ContentBox = styled(Box)({
  position: "relative",
});

const CopyBox = styled(Box)({
  position: "absolute",
  top: "80px",
  right: "40px",
  zIndex: 3,
});

const SourceCodeTabs = styled(Tabs)({
  borderBottom: "1px solid #E8E8E8",
  "& .MuiTabs-indicator": {
    borderBottom: "4px solid #0088CC",
    borderRadius: 20,
  },
  "& .MuiTab-root.Mui-selected": {
    color: "#000",
    fontWeight: 800,
  },
});

type DomIds = {
  containerId: string;
  filesId: string;
  contentId: string;
};

type TabConfig =
  | { id: string; label: string; type: "disassembled" }
  | {
      id: string;
      label: string;
      type: "sources";
      proof: ContractProofData;
      domIds: DomIds;
      getterKey: string;
    }
  | {
      id: string;
      label: string;
      type: "getters";
      proof: ContractProofData;
      getterKey: string;
    };

function ContractSourceCode() {
  const { contractAddress } = useContractAddress();
  const { data: verifierRegistry } = useLoadVerifierRegistryInfo();
  const { data: proofMap } = useLoadContractProof();
  const [value, setValue] = useState(0);
  const isExtraSmallScreen = useMediaQuery("(max-width: 450px)");
  const modifiedCodeBlock = useMediaQuery("(max-width: 600px)");
  const { showNotification } = useNotification();

  const verifierEntries = useMemo(() => Object.entries(verifierRegistry ?? {}), [verifierRegistry]);

  const verifierProofs = useMemo(
    () =>
      verifierEntries.map(([id, config]) => {
        const safeKey = `${contractAddress ?? "unknown"}-${id}`.replace(/[^a-zA-Z0-9]/g, "-");
        return {
          id,
          config,
          getterKey: `${contractAddress ?? "unknown"}::${id}`,
          domIds: {
            containerId: `${safeKey}-container`,
            filesId: `${safeKey}-files`,
            contentId: `${safeKey}-content`,
          },
          proof: proofMap?.get(id),
        };
      }),
    [verifierEntries, proofMap, contractAddress],
  );

  const tabs = useMemo<TabConfig[]>(() => {
    const initialTabs: TabConfig[] = [
      { id: "disassembled", label: "Disassembled", type: "disassembled" },
    ];

    const isOrbs = (name: string) => name.toLowerCase().includes("orbs");
    const proofVerifiers = verifierProofs.filter(({ proof }) => !!proof?.hasOnchainProof);
    const hasOnlyOrbsProof =
      proofVerifiers.length > 0 &&
      proofVerifiers.every(({ id, config }) => isOrbs(config.name || id));
    const verifiersForTabs = hasOnlyOrbsProof
      ? proofVerifiers
      : proofVerifiers.filter(({ id, config }) => !isOrbs(config.name || id));

    verifiersForTabs.forEach(({ id, config, proof, getterKey, domIds }) => {
      if (!!proof) {
        const labelSuffix = config.name || id;
        initialTabs.push({
          id: `sources-${id}`,
          label: `Sources (${labelSuffix})`,
          type: "sources",
          proof: proof,
          domIds,
          getterKey,
        });
        initialTabs.push({
          id: `getters-${id}`,
          label: `Getters (${labelSuffix})`,
          type: "getters",
          proof: proof,
          getterKey,
        });
      }
    });
    return initialTabs;
  }, [verifierProofs]);

  const hasAnyProof = tabs.some((tab) => tab.type === "sources");

  useEffect(() => {
    const firstSourcesIndex = tabs.findIndex((tab) => tab.type === "sources");
    setValue(firstSourcesIndex !== -1 ? firstSourcesIndex : 0);
  }, [tabs.length, hasAnyProof]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleCopy = useCallback(
    (selector: string) => {
      const element = document.querySelector(selector) as HTMLElement | null;
      if (!element) return;
      navigator.clipboard.writeText(element.innerText);
      showNotification("Copied to clipboard!", "success");
    },
    [showNotification],
  );

  const activeTab = tabs[value] ?? tabs[0];
  const activeProof = activeTab && activeTab.type !== "disassembled" ? activeTab.proof : undefined;

  return (
    <Box
      sx={{
        border: "0.5px solid rgba(114, 138, 150, 0.24)",
        boxShadow: "rgb(114 138 150 / 8%) 0px 2px 16px",
        borderRadius: "20px",
        position: "relative",
      }}>
      <TitleBox mb={1}>
        <TitleWrapper>
          <CenteringBox mb={isExtraSmallScreen ? 2 : 0} sx={{ width: "100%" }}>
            <IconBox>
              <img src={verified} alt="Block icon" width={41} height={41} />
            </IconBox>
            <TitleText>
              {hasAnyProof && "Verified"} Source {isExtraSmallScreen && <br />} Code
            </TitleText>
          </CenteringBox>
          {activeTab?.type === "sources" && (
            <Box
              sx={{
                alignSelf: "baseline",
                position: "relative",
                top: !modifiedCodeBlock ? "3px" : "5px",
              }}>
              <AppButton
                fontSize={12}
                fontWeight={500}
                hoverBackground="#F5F5F5"
                background="#F2F2F2"
                height={modifiedCodeBlock ? 30 : 37}
                width={modifiedCodeBlock ? 30 : 167}
                onClick={() => {
                  const validFiles = getValidSources(activeProof?.files);
                  validFiles.length && downloadSources(validFiles);
                }}>
                <img src={download} alt="Download icon" width={19} height={19} />
                {modifiedCodeBlock ? "" : "Download sources"}
              </AppButton>
            </Box>
          )}
        </TitleWrapper>
      </TitleBox>
      <ContentBox p={3}>
        <SourceCodeTabs value={value} onChange={handleChange}>
          {tabs.map((tab, index) => (
            <Tab key={tab.id} value={index} sx={{ textTransform: "none" }} label={tab.label} />
          ))}
        </SourceCodeTabs>
        {tabs.map((tab, index) => {
          if (tab.type === "disassembled") {
            return (
              <Box key={tab.id} sx={{ display: value === index ? "block" : "none" }}>
                <DisassembledSourceCode
                  button={
                    <CopyButton onCopy={() => handleCopy(`pre > code > div.hljs.language-fift`)} />
                  }
                />
              </Box>
            );
          }
          if (tab.type === "sources") {
            return (
              <Box key={tab.id} sx={{ display: value === index ? "block" : "none" }}>
                <VerifiedSourceCode
                  proofData={tab.proof}
                  domIds={tab.domIds!}
                  button={
                    <CopyButton
                      onCopy={() =>
                        handleCopy(`#${tab.domIds!.contentId} .contract-verifier-code-copy`)
                      }
                    />
                  }
                />
              </Box>
            );
          }
          return (
            <VerifierGettersPanel
              key={tab.id}
              getterKey={tab.getterKey}
              proof={tab.proof}
              isVisible={value === index}
            />
          );
        })}
      </ContentBox>
    </Box>
  );
}

function VerifierGettersPanel({
  getterKey,
  proof,
  isVisible,
}: {
  getterKey: string;
  proof: ContractProofData;
  isVisible: boolean;
}) {
  const validSources = useMemo(() => getValidSources(proof?.files), [proof?.files]);
  useSyncGetters(getterKey, validSources);
  return (
    <Box sx={{ display: isVisible ? "block" : "none" }}>
      <Getters getterKey={getterKey} />
    </Box>
  );
}

const CopyButton = ({ onCopy }: { onCopy: () => void }) => {
  return (
    <CopyBox>
      <IconButton onClick={onCopy}>
        <img alt="Copy Icon" src={copy} width={16} height={16} />
      </IconButton>
    </CopyBox>
  );
};

export default ContractSourceCode;
