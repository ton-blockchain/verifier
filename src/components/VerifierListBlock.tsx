import { Box, Skeleton, Typography, styled } from "@mui/material";
import React from "react";
import { useLoadVerifierRegistryInfo } from "../lib/useLoadVerifierRegistryInfo";
import { CenteringBox } from "./Common.styled";
import { CopyHash } from "./CopyHash";
import { DataBlock, DataRowItem } from "./DataBlock";
import { VerifierWithId } from "../lib/wrappers/verifier-registry";
import verificationIcon from "../assets/verification-popup.svg";

const VerifierCard = ({ verifierId, config }: { verifierId: string; config: VerifierWithId }) => {
  const dataRows: DataRowItem[] = [
    {
      title: "Verifier ID",
      value: <CopyHash value={verifierId} maxSize={36} />,
    },
    { title: "URL", value: config.url },
    {
      title: "Admin",
      value: <CopyHash value={config.admin.toString()} maxSize={64} />,
      showIcon: true,
    },
    { title: "Quorum", value: String(config.quorum) },
    {
      title: "Endpoints",
      value: (
        <>
          {Object.entries(config.pubKeyEndpoints).map(([pubKey, endpoint]) => (
            <Typography key={pubKey} sx={{ fontSize: 13, color: "#4A4C4F" }}>
              {endpoint} <CopyHash value={pubKey} />
            </Typography>
          ))}
        </>
      ),
    },
  ];

  return (
    <DataBlock title={config.name} icon={verificationIcon} dataRows={dataRows} isFlexibleWrapper />
  );
};

const ContractsWrapper = styled(Box)(({ theme }) => ({
  maxWidth: 1160,
  width: "calc(100% - 50px)",
  paddingTop: 20,
  margin: "0 auto",
}));

export function VerifierListBlock() {
  const { data, isLoading, isEnabled } = useLoadVerifierRegistryInfo();
  const verifiers = Object.entries(data ?? {});
  const hasVerifiers = verifiers.length > 0;

  return (
    <ContractsWrapper>
      <Typography variant="h6">
        <b>Verifiers</b>
      </Typography>
      {(isLoading || !isEnabled) && !hasVerifiers && (
        <Box>
          <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2, mb: 2 }} />
        </Box>
      )}
      {hasVerifiers ? (
        <>
          {verifiers
            .filter((i) => !i[1].name.includes("orbs"))
            .map(([id, config]) => (
              <Box key={id}>
                <VerifierCard verifierId={id} config={config} />
              </Box>
            ))}
        </>
      ) : (
        isEnabled &&
        !isLoading && (
          <CenteringBox>
            <Typography sx={{ fontSize: 14, color: "#4A4C4F" }}>
              No verifiers available for this network.
            </Typography>
          </CenteringBox>
        )
      )}
    </ContractsWrapper>
  );
}
