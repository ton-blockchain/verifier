import { Box, Skeleton, styled, Typography } from "@mui/material";
import { useLoadLatestVerified } from "../lib/useLoadLatestVerified";
import { useRef } from "react";
import { useLoadVerifierRegistryInfo } from "../lib/useLoadVerifierRegistryInfo";
import { CopyHash } from "./CopyHash";
import { Link as RouterLink, useLocation } from "react-router-dom";

const Contract = styled(RouterLink)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  background: "white",
  padding: "16px 20px",
  borderRadius: 10,
  boxShadow: "rgb(114 138 150 / 8%) 0px 2px 16px",
  border: "0.5px solid rgba(114, 138, 150, 0.24)",
  cursor: "pointer",
  textDecoration: "none",
  color: "inherit",
  overflow: "hidden",
}));

const ContractsWrapper = styled(Box)(({ theme }) => ({
  maxWidth: 1160,
  width: "calc(100% - 50px)",
  paddingTop: 20,
  margin: "0 auto",
}));

const ContractsList = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 24,
  margin: "0 auto",
  overflow: "hidden",
  marginTop: 24,
  WebkitTextSizeAdjust: "100%",
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

const AddressText = styled(Box)({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: 16,
  color: "#728A96",
});

const CompilerText = styled(Box)({
  marginLeft: "auto",
  fontSize: 14,
  background: "#F0F0F099",
  color: "#728A9699",
  padding: "2px 12px",
  borderRadius: 4,
});

export function LatestVerifiedContracts() {
  const { data: latestVerifiedContracts, isLoading } = useLoadLatestVerified();
  const { data: verifierRegistry } = useLoadVerifierRegistryInfo();
  const location = useLocation();
  const skeletons = useRef(new Array(30).fill(null).map((_) => Math.random() * 100));
  const createContractLink = (address: string) => ({
    pathname: `/${address}`,
    search: location.search,
    hash: location.hash,
  });

  return (
    <ContractsWrapper>
      <Typography variant="h6">
        <b>Latest verified contracts</b>
      </Typography>
      <ContractsList>
        {isLoading &&
          skeletons.current.map((width: number, index: number) => (
            <Skeleton
              key={`latest-contract-skeleton-${index}`}
              sx={{ borderRadius: 2 }}
              variant="rectangular"
              width={400 + width}
              height={70}></Skeleton>
          ))}
        {latestVerifiedContracts?.map((contract, j) => {
          const verifierName = contract.verifierId
            ? verifierRegistry?.["0x" + contract.verifierId]?.name
            : undefined;
          const verifiedDate =
            contract.timestamp && new Date(contract.timestamp * 1000).toLocaleDateString();
          return (
            <Contract key={contract.address + j} to={createContractLink(contract.address)}>
              <AddressText>{contract.address}</AddressText>
              <div style={{ display: "flex", alignItems: "center", marginTop: 6.5 }}>
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#728A9699",
                  }}>
                  {contract.mainFile}
                </Typography>
                <CompilerText>{contract.compiler}</CompilerText>
              </div>
              {verifierName || contract.verifierId || verifiedDate ? (
                <Typography sx={{ fontSize: 13, color: "#728A96", marginTop: 4 }}>
                  Verified {verifiedDate && <>on&nbsp;{verifiedDate}</>}{" "}
                  {verifierName ? (
                    <>by&nbsp;{verifierName}</>
                  ) : contract.verifierId ? (
                    <>
                      by&nbsp;
                      <CopyHash value={contract.verifierId} maxSize={18} />
                    </>
                  ) : null}
                </Typography>
              ) : null}
            </Contract>
          );
        })}
      </ContractsList>
    </ContractsWrapper>
  );
}
