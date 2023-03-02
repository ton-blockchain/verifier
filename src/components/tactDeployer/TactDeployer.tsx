import { Address, Cell, StateInit, toNano, contractAddress } from "ton";
import { getClient } from "../../lib/getClient";
import { useSendTXN } from "../../lib/useSendTxn";
import { useWalletConnect } from "../../lib/useWalletConnect";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress, Skeleton, styled, useMediaQuery, useTheme } from "@mui/material";
import contractIcon from "../../assets/contract.svg";
import { ContentBox, ContractDataBox } from "../../App";
import { DataBlock, DataRowItem } from "../DataBlock";
import { AppNotification, NotificationType } from "../AppNotification";
import { DataBox, CenteringBox, IconBox, TitleText } from "../Common.styled";
import { NotificationTitle } from "../CompileOutput";
import { TopBar } from "./TopBar";
import { Footer } from "../Footer";
import { FlexBoxColumn, FlexBoxRow } from "../Getters.styled";
import { AppButton } from "../AppButton";
import { workchainForAddress } from "../../lib/workchainForAddress";
import { getProofIpfsLink } from "../../lib/useLoadContractProof";

const IPFS_GW = "https://tact-deployer.infura-ipfs.io";

async function fetchFromIpfs(hash: string) {
  return fetch(`${IPFS_GW}/ipfs/${hash}`);
}

function useTactDeployer({ workchain }: { workchain: 0 | -1 }) {
  const { ipfsHash } = useParams();

  const { data, error, isLoading } = useQuery(["tactDeploy", ipfsHash], async () => {
    if (!ipfsHash) return null;
    const tc = await getClient();
    const content = await fetchFromIpfs(ipfsHash).then((res) => res.json());
    const pkg = await fetchFromIpfs(content.pkg).then((res) => res.json());
    const dataCell = await fetchFromIpfs(content.dataCell)
      .then((res) => res.arrayBuffer())
      .then((buf) => Cell.fromBoc(Buffer.from(buf))[0]);

    const codeCell = Cell.fromBoc(Buffer.from(pkg.code, "base64"))[0];
    const address = contractAddress({ workchain, initialCode: codeCell, initialData: dataCell });
    const stateInit = new StateInit({ code: codeCell, data: dataCell });

    const codeCellHash = codeCell.hash().toString("base64");

    const isDeployed = await tc.isContractDeployed(address);
    const hasProof = isDeployed && (await getProofIpfsLink(codeCellHash));

    return {
      address,
      stateInit,
      pkg,
      codeCellHash,
      isDeployed,
      hasProof,
    };
  });

  return { data, error, isLoading };
}

function useDeployContract(stateInit?: StateInit, address?: Address) {
  const { sendTXN, data, clearTXN } = useSendTXN("deployContract", async (count: number) => {
    if (!address) throw new Error("No address");
    const tc = await getClient();

    // TODO move to generic function
    if (count > 20) {
      return "error";
    }

    return (await tc.isContractDeployed(address)) ? "success" : "issued";
  });

  return {
    sendTXN: () => {
      if (!address) return;
      sendTXN(address, import.meta.env.DEV ? toNano(0.4) : toNano(0.5), undefined, stateInit);
    },
    status: data.status,
    clearTXN,
  };
}

export function ContractBlock() {
  const dataRows: DataRowItem[] = [];

  const { data, error } = useTactDeployer({ workchain: 0 });

  if (data) {
    dataRows.push({
      title: "Name",
      value: data.pkg.name,
    });
    dataRows.push({
      title: "Compiler",
      value: `Tact ${data.pkg.compiler.version}`,
    });
    dataRows.push({
      title: "Code Hash",
      value: data.codeCellHash,
    });
    dataRows.push({
      title: "Workchain",
      value: workchainForAddress(data.address.toFriendly()),
    });
  }

  const isLoading = false;

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
  const { sendTXN, status } = useDeployContract(data?.stateInit, data?.address);
  const navigate = useNavigate();

  let statusText: string | JSX.Element = "";

  if (error) {
    statusText = error.toString();
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
        statusText = "";
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

  if (data?.isDeployed && !data.hasProof) {
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
          navigate("/" + data.address.toFriendly());
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
                value={value}
                type="number"
                onChange={(e) => {
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
                    {data?.address.toFriendly()}
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

export const CustomValueInput = styled("input")({
  display: "flex",
  alignItems: "center",
  paddingLeft: 14,
  boxSizing: "border-box",
  height: 34,
  background: "#FFFFFF",
  border: "1px solid #D8D8D8",
  borderRadius: "12px",
  fontSize: 14,
  fontFamily: "Mulish",
  outline: "none",
  "&:hover": {
    border: "1px solid #b0b0b0",
  },
  "&:focus": {
    border: "1px solid #807e7e",
  },
});

export function TactDeployer() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const headerSpacings = useMediaQuery(theme.breakpoints.down("lg"));
  const { restoreConnection } = useWalletConnect();

  useEffect(() => {
    restoreConnection();
  }, []);
  const { data, error, isLoading } = useTactDeployer({ workchain: 0 });

  return (
    <Box>
      <TopBar />
      <ContentBox px={headerSpacings ? "20px" : 0}>
        {isLoading && (
          <FlexBoxColumn sx={{ marginTop: 3 }}>
            <Skeleton height={330} variant="rounded" sx={{ marginBottom: 3 }} />
            <Skeleton height={280} variant="rounded" />
          </FlexBoxColumn>
        )}
        {!isLoading && (
          <>
            <ContractDataBox isMobile={isSmallScreen}>
              <ContractBlock />
            </ContractDataBox>
            <DeployBlock />
          </>
        )}
      </ContentBox>
      )
      <Footer />
    </Box>
  );
}
