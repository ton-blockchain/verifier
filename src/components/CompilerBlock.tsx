import {
  Box,
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  FiftCliCompileSettings,
  FuncCompilerSettings,
  TactCliCompileSettings,
  TolkCliCompileSettings,
} from "../types/compiler";
import { useMemo } from "react";
import compilerIcon from "../assets/compiler.svg";
import { CopyHash } from "./CopyHash";
import { CenteringBox, DataBox, IconBox, TitleBox, TitleText } from "./Common.styled";
import { ContractProofData, useLoadContractProof } from "../lib/useLoadContractProof";
import { useLoadVerifierRegistryInfo } from "../lib/useLoadVerifierRegistryInfo";
import {
  dropPatchVersionZero,
  fiftVersionToLink,
  funcVersionToLink,
  tactVersionToLink,
  tolkVersionToLink,
} from "../utils/linkUtils";

interface RowData {
  id: string;
  name: string;
  compilerLabel: string;
  compilerLink?: string;
  command?: string;
  verifiedOn?: string;
  hasProof: boolean;
}

function getCompilerVersionData(proof?: ContractProofData) {
  if (!proof) return { label: undefined, link: undefined };
  if (proof.compiler === "func") {
    const version = (proof.compilerSettings as FuncCompilerSettings | undefined)?.funcVersion;
    return {
      label: version,
      link: version ? funcVersionToLink(version) : undefined,
    };
  }
  if (proof.compiler === "fift") {
    const version = (proof.compilerSettings as FiftCliCompileSettings | undefined)?.fiftVersion;
    return {
      label: version,
      link: version ? fiftVersionToLink(version) : undefined,
    };
  }
  if (proof.compiler === "tact") {
    const version = (proof.compilerSettings as TactCliCompileSettings | undefined)?.tactVersion;
    return {
      label: version,
      link: version ? tactVersionToLink(version) : undefined,
    };
  }
  if (proof.compiler === "tolk") {
    const version = (proof.compilerSettings as TolkCliCompileSettings | undefined)?.tolkVersion;
    return {
      label: version && dropPatchVersionZero(version),
      link: version ? tolkVersionToLink(version) : undefined,
    };
  }
  return { label: undefined, link: undefined };
}

function getCompilerCommand(proof?: ContractProofData) {
  if (!proof) return undefined;
  if (proof.compiler === "func") {
    return (proof.compilerSettings as FuncCompilerSettings | undefined)?.commandLine;
  }
  if (proof.compiler === "fift") {
    return (proof.compilerSettings as FiftCliCompileSettings | undefined)?.commandLine;
  }
  return undefined;
}

function formatCompilerInfo(proof?: ContractProofData) {
  if (!proof || !proof.hasOnchainProof) {
    return { label: "No proof available", link: undefined };
  }
  const compilerName = proof.compiler ?? "";
  const { label: compilerVersion, link } = getCompilerVersionData(proof);
  const label = [compilerName, compilerVersion].filter(Boolean).join(" ") || compilerName || "-";
  return { label, link };
}

export function CompilerBlock() {
  const { data: proofs } = useLoadContractProof();
  const { data: verifierRegistry } = useLoadVerifierRegistryInfo();

  const verifierEntries = useMemo(() => Object.entries(verifierRegistry ?? {}), [verifierRegistry]);

  const rows = useMemo<RowData[]>(() => {
    if (!verifierEntries.length) {
      return [];
    }
    // NOTE: remove orbs if no source
    const allRows = verifierEntries.map(([id, config]) => {
      const proof = proofs?.get(id);
      const hasProof = !!proof?.hasOnchainProof;
      const compilerInfo = formatCompilerInfo(proof);
      return {
        id,
        name: config.name || id,
        compilerLabel: compilerInfo.label,
        compilerLink: compilerInfo.link,
        command: hasProof ? getCompilerCommand(proof) : undefined,
        verifiedOn:
          hasProof && proof?.verificationDate
            ? proof.verificationDate.toLocaleDateString()
            : undefined,
        hasProof,
      };
    });

    const isOrbs = (row: RowData) => row.name.toLowerCase().includes("orbs");
    const proofRows = allRows.filter((row) => row.hasProof);
    const hasOnlyOrbsProof = proofRows.length > 0 && proofRows.every(isOrbs);

    if (hasOnlyOrbsProof) {
      return allRows;
    }

    return allRows.filter((row) => row.hasProof && !isOrbs(row));
  }, [verifierEntries, proofs]);

  const hasVerifiers = verifierEntries.length > 0;
  const hasAnyProof = rows.some((row) => row.hasProof);

  return (
    <DataBox>
      <TitleBox mb={2}>
        <CenteringBox
          sx={{ justifyContent: "space-between", width: "100%", flexWrap: "wrap", gap: 1.5 }}>
          <CenteringBox>
            <IconBox>
              <img src={compilerIcon} alt="Verifier icon" width={41} height={41} />
            </IconBox>
            <TitleText>Verifications</TitleText>
          </CenteringBox>
        </CenteringBox>
      </TitleBox>
      <Box px={3} pb={3}>
        {hasVerifiers ? (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={headCellSx}>Verifier ID</TableCell>
                    <TableCell sx={headCellSx}>Verifier name</TableCell>
                    <TableCell sx={headCellSx}>Compiler</TableCell>
                    <TableCell sx={headCellSx}>Command</TableCell>
                    <TableCell sx={headCellSx}>Verified on</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell sx={bodyCellSx}>
                        <CopyHash value={row.id} maxSize={20} />
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#161C28" }}>
                          {row.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        {row.compilerLink && row.hasProof ? (
                          <MuiLink
                            href={row.compilerLink}
                            target="_blank"
                            rel="noopener"
                            sx={{ fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                            {row.compilerLabel}
                          </MuiLink>
                        ) : (
                          <Typography
                            sx={{ fontSize: 13, color: row.hasProof ? "#161C28" : "#728A96" }}>
                            {row.compilerLabel || "-"}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ ...bodyCellSx, minWidth: 200 }}>
                        {row.command ? (
                          <Typography
                            component="span"
                            sx={{
                              fontSize: 12,
                              fontFamily: "monospace",
                              color: "#161C28",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}>
                            {row.command}
                          </Typography>
                        ) : (
                          <Typography sx={{ fontSize: 13, color: "#728A96" }}>-</Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ ...bodyCellSx, minWidth: 130 }}>
                        <Typography
                          sx={{ fontSize: 13, color: row.verifiedOn ? "#161C28" : "#728A96" }}>
                          {row.verifiedOn ?? "-"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {!hasAnyProof && (
              <Typography mt={2} sx={{ fontSize: 13, color: "#728A96" }}>
                No verifiers have published proofs for this contract yet.
              </Typography>
            )}
          </>
        ) : (
          <Typography sx={{ fontSize: 14, color: "#728A96" }}>
            No verifiers available for this network.
          </Typography>
        )}
      </Box>
    </DataBox>
  );
}

const headCellSx = {
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase",
  color: "#728A96",
  borderBottom: "1px solid rgba(114, 138, 150, 0.2)",
  paddingTop: 1.5,
  paddingBottom: 1.5,
};

const bodyCellSx = {
  fontSize: 14,
  color: "#161C28",
  borderBottom: "1px solid rgba(114, 138, 150, 0.15)",
  paddingTop: 1.5,
  paddingBottom: 1.5,
};
