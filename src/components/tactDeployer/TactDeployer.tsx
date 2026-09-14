import { Address, Cell, contractAddress, StateInit, toNano } from "@ton/ton";
import { useClient, useSourcesRegistryAddress } from "../../lib/useClient";
import { useSendTXN } from "../../lib/useSendTxn";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress, Skeleton, useMediaQuery, useTheme } from "@mui/material";
import contractIcon from "../../assets/contract.svg";
import { ContentBox, ContractDataBox } from "../Layout";
import { DataBlock, DataRowItem } from "../DataBlock";
import { AppNotification, NotificationType } from "../AppNotification";
import { CenteringBox, DataBox, IconBox, TitleText } from "../Common.styled";
import { NotificationTitle } from "../CompileOutput";
import { TopBar } from "./TopBar";
import { Footer } from "../Footer";
import { FlexBoxColumn, FlexBoxRow } from "../Getters.styled";
import { AppButton } from "../AppButton";
import { workchainForAddress } from "../../lib/workchainForAddress";
import { getProofIpfsLink } from "../../lib/useLoadContractProof";
import { useFileStore } from "../../lib/useFileStore";
import { usePreload } from "../../lib/usePreload";
import { CustomValueInput } from "./TactDeployer.styled";
import { useNavigatePreserveQuery } from "../../lib/useNavigatePreserveQuery";
import { TestnetBar, useIsTestnet } from "../TestnetBar";
import { fetchIpfsContent } from "../../lib/fetchIpfsContent";

const deployableTraitInitMessage = Cell.fromBoc(
  Buffer.from("te6cckEBAQEADgAAGJRqmLYAAAAAAAAAAOnNeQ0=", "base64"),
)[0];

class IpfsNotFoundError extends Error {
  constructor(hash: string) {
    super(`Tact package could not be found in IPFS (hash: ${hash})`);
    this.name = "IpfsNotFoundError";
  }
}

class IpfsServerError extends Error {
  constructor(hash: string, status: number) {
    super(`IPFS server error ${status} for hash: ${hash}`);
    this.name = "IpfsServerError";
  }
}

async function fetchFromIpfs(hash: string) {
  const { response } = await fetchIpfsContent(hash);

  if (!response.ok) {
    // For 4xx errors (client errors like 404), throw a specific error
    if (response.status >= 400 && response.status < 500) {
      throw new IpfsNotFoundError(hash);
    }
    // For 5xx errors (server errors), throw a different error that can be retried
    throw new IpfsServerError(hash, response.status);
  }

  return response;
}

function useTactDeployer({
  workchain,
  verifier = "verifier.ton.org",
}: {
  workchain: 0 | -1;
  verifier?: string;
}) {
  const { ipfsHash } = useParams();
  const tc = useClient();
  const sourcesRegistryAddress = useSourcesRegistryAddress();
  const isTestnet = useIsTestnet();

  const { data, error, isLoading } = useQuery({
    enabled: !!tc && !!ipfsHash,
    queryKey: ["tactDeploy", ipfsHash, isTestnet],
    queryFn: async () => {
      if (!ipfsHash || !tc) return null;
      const content = await fetchFromIpfs(ipfsHash).then((res) => res.json());
      const pkgPromise = await fetchFromIpfs(content.pkg.replace("ipfs://", "")).then((res) =>
        res.json(),
      );
      const dataCellPromise = await fetchFromIpfs(content.dataCell.replace("ipfs://", ""))
        .then((res) => res.arrayBuffer())
        .then((buf) => Cell.fromBoc(Buffer.from(buf))[0]);

      const [pkg, dataCell] = [await pkgPromise, await dataCellPromise];

      const codeCell = Cell.fromBoc(Buffer.from(pkg.code, "base64"))[0];
      const address = contractAddress(workchain, { code: codeCell, data: dataCell });
      const stateInit = { code: codeCell, data: dataCell };

      const dataCellHash = dataCell.hash().toString("base64");
      const codeCellHash = codeCell.hash().toString("base64");

      const isDeployed = await tc.isContractDeployed(address);
      const hasProof =
        isDeployed &&
        (await getProofIpfsLink(codeCellHash, verifier, isTestnet, {
          tonClient: tc,
          sourcesRegistry: sourcesRegistryAddress,
        }));

      return {
        address,
        stateInit,
        pkg,
        codeCellHash,
        dataCellHash,
        isDeployed,
        hasProof,
      };
    },
    retry: (failureCount, error) => {
      // Don't retry for 4xx errors (not found, etc.)
      if (error instanceof IpfsNotFoundError) {
        return false;
      }
      // Retry up to 2 times for server errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return { data, error, isLoading };
}

function useDeployContract(value: string, stateInit?: StateInit, address?: Address) {
  const tc = useClient();
  const { sendTXN, data, clearTXN } = useSendTXN("deployContract", async (count: number) => {
    if (!tc) throw new Error("No client");
    if (!address) throw new Error("No address");

    // TODO move to generic function
    if (count > 20) {
      return "error";
    }

    return (await tc.isContractDeployed(address)) ? "success" : "issued";
  });

  return {
    sendTXN: () => {
      if (!address) return;
      sendTXN({
        to: address,
        value: toNano(value),
        message: deployableTraitInitMessage,
        stateInit,
      });
    },
    status: data.status,
    clearTXN,
  };
}

export function ContractBlock() {
  const { data, error, isLoading } = useTactDeployer({ workchain: 0 });

  const dataRows = useMemo<DataRowItem[]>(() => {
    if (!data) return [];
    return [
      {
        title: "Name",
        value: data.pkg.name,
      },
      {
        title: "Compiler",
        value: `Tact ${data.pkg.compiler.version}`,
      },
      {
        title: "Code Hash",
        value: data.codeCellHash,
      },
      {
        title: "Data Hash",
        value: data.dataCellHash,
      },
      {
        title: "Workchain",
        value: workchainForAddress(data.address.toString()),
      },
    ];
  }, [data]);

  return (
    <DataBlock
      title="Contract"
      icon={contractIcon}
      dataRows={dataRows}
      isLoading={isLoading}
      isFlexibleWrapper={true}
    />
  );
}

function DeployBlock() {
  const [value, setValue] = useState("0.5");
  const { data, error } = useTactDeployer({ workchain: 0 });
  const { sendTXN, status } = useDeployContract(value, data?.stateInit, data?.address);
  const { markPreloaded } = usePreload();
  const navigate = useNavigatePreserveQuery();
  const file = useFileStore();

  let statusText: string | JSX.Element = "";

  if (error) {
    if (error instanceof IpfsNotFoundError) {
      statusText =
        "The requested Tact package could not be found in IPFS. Please verify the package hash.";
    } else if (error instanceof IpfsServerError) {
      statusText =
        "Failed to fetch the Tact package from IPFS due to a server error. Please try again later.";
    } else {
      statusText = `Error loading Tact package: ${error instanceof Error ? error.message : String(error)}`;
    }
  } else if (data?.isDeployed) {
    statusText = (
      <div>
        Contract is already deployed.
        {!data.hasProof && " You can publish its sources to verify it."}
      </div>
    );
  } else {
    switch (status) {
      case "initial":
        statusText = "Contract is ready for deployment";
        break;
      case "pending":
        statusText = "Please approve the transaction in your wallet";
        break;
      case "issued":
        statusText = "Transaction was issued. Monitoring deployment...";
        break;
      case "rejected":
        statusText = "Transaction was rejected. Please retry.";
        break;
      case "error":
        statusText = "Transaction failed. Please retry.";
        break;
      case "expired":
        statusText = "Transaction expired. Please retry.";
        break;
      case "success":
        statusText =
          "Contract deployed successfully! You can now publish its sources to verify it.";
        break;
    }
  }

  let button = (
    <AppButton
      disabled={status === "pending" || status === "issued" || data?.isDeployed}
      fontSize={14}
      fontWeight={800}
      textColor="#fff"
      height={44}
      width={144}
      background="#1976d2"
      hoverBackground="#156cc2"
      onClick={() => {
        sendTXN();
      }}>
      {(status === "pending" || status === "issued") && (
        <CircularProgress
          sx={{ color: "#fff", height: "20px !important", width: "20px !important" }}
        />
      )}
      Deploy
    </AppButton>
  );

  if (status === "success" || (data?.isDeployed && !data.hasProof)) {
    button = (
      <AppButton
        fontSize={14}
        fontWeight={800}
        textColor="#fff"
        height={44}
        width={144}
        background="#1976d2"
        hoverBackground="#156cc2"
        onClick={() => {
          markPreloaded();
          navigate("/" + data!.address.toString());
          file.addFiles([
            new File([JSON.stringify(data!.pkg)], data!.pkg.name + ".pkg", { type: "text/plain" }),
          ]);
        }}>
        Verify
      </AppButton>
    );
  }

  return (
    <DataBox mb={6}>
      <CenteringBox p={"30px 24px 0 24px"}>
        <IconBox>
          <img src={contractIcon} alt="publish icon" width={41} height={41} />
        </IconBox>
        <TitleText>Deploy</TitleText>
      </CenteringBox>

      <Box>
        <Box sx={{ padding: "0 30px" }}>
          <FlexBoxRow gap={2} sx={{ mt: 2 }}>
            <FlexBoxColumn>
              <div>Value to initialize contract (TON)</div>
            </FlexBoxColumn>
            <FlexBoxColumn>
              <CustomValueInput
                disabled={!!data?.isDeployed || status === "issued" || status == "pending"}
                value={value}
                type="number"
                onChange={(e: any) => {
                  setValue(e.target.value);
                }}
              />
            </FlexBoxColumn>
          </FlexBoxRow>

          <AppNotification
            type={NotificationType.HINT}
            title={<></>}
            notificationBody={
              <CenteringBox sx={{ overflow: "auto", maxHeight: 300 }}>
                <NotificationTitle sx={{ marginBottom: 0 }}>
                  <Box sx={{ fontWeight: 600 }}>Contract Address</Box>
                  <Box sx={{ fontSize: 18, fontWeight: 700, wordBreak: "break-all" }}>
                    {data?.address.toString()}
                  </Box>
                </NotificationTitle>
              </CenteringBox>
            }
          />
          <AppNotification
            type={NotificationType.INFO}
            title={<></>}
            notificationBody={
              <CenteringBox sx={{ overflow: "auto", maxHeight: 300 }}>
                <NotificationTitle sx={{ marginBottom: 0 }}>{statusText}</NotificationTitle>
              </CenteringBox>
            }
          />
          {button}
        </Box>
        <CenteringBox mb={3} sx={{ justifyContent: "center" }}></CenteringBox>
      </Box>
    </DataBox>
  );
}

export function TactDeployer() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const headerSpacings = useMediaQuery(theme.breakpoints.down("lg"));

  const { data, error, isLoading } = useTactDeployer({ workchain: 0 });
  const isTestnet = useIsTestnet();

  let errorMessage = "";
  if (error) {
    if (error instanceof IpfsNotFoundError) {
      errorMessage =
        "The requested Tact package could not be found in IPFS. Please verify the package hash.";
    } else if (error instanceof IpfsServerError) {
      errorMessage =
        "Failed to fetch the Tact package from IPFS due to a server error. Please try again later.";
    } else {
      errorMessage = `Error loading Tact package: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  return (
    <Box>
      {isTestnet && <TestnetBar />}
      <TopBar />
      <ContentBox px={headerSpacings ? "20px" : 0}>
        <>
          {isLoading && (
            <FlexBoxColumn sx={{ marginTop: 3 }}>
              <Skeleton height={330} variant="rounded" sx={{ marginBottom: 3 }} />
              <Skeleton height={280} variant="rounded" />
            </FlexBoxColumn>
          )}
          {!isLoading && error && (
            <FlexBoxColumn sx={{ marginTop: 3 }}>
              <AppNotification
                type={NotificationType.ERROR}
                title={<>Error</>}
                notificationBody={
                  <CenteringBox sx={{ overflow: "auto", maxHeight: 300 }}>
                    <NotificationTitle sx={{ marginBottom: 0 }}>{errorMessage}</NotificationTitle>
                  </CenteringBox>
                }
              />
            </FlexBoxColumn>
          )}
          {!isLoading && !error && (
            <>
              <ContractDataBox isMobile={isSmallScreen}>
                <ContractBlock />
              </ContractDataBox>
              <DeployBlock />
            </>
          )}
        </>
      </ContentBox>
      )
      <Footer />
    </Box>
  );
}
