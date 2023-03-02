import { Address, Cell, StateInit, toNano, contractAddress } from "ton";
import { getClient } from "../../lib/getClient";
import { useSendTXN } from "../../lib/useSendTxn";
import { TopBar } from "../TopBar";
import { useWalletConnect } from "../../lib/useWalletConnect";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const IPFS_GW = "https://tact-deployer.infura-ipfs.io";

async function fetchFromIpfs(hash: string) {
  return fetch(`${IPFS_GW}/ipfs/${hash}`);
}

function useTactDeployer({ workchain }: { workchain: 0 | -1 }) {
  const { ipfsHash } = useParams();

  const { data, error } = useQuery(["tactDeploy", ipfsHash], async () => {
    if (!ipfsHash) return null;
    const content = await fetchFromIpfs(ipfsHash).then((res) => res.json());
    const pkg = await fetchFromIpfs(content.pkg).then((res) => res.json());
    const dataCell = await fetchFromIpfs(content.dataCell)
      .then((res) => res.arrayBuffer())
      .then((buf) => Cell.fromBoc(Buffer.from(buf))[0]);

    const codeCell = Cell.fromBoc(Buffer.from(pkg.code, "base64"))[0];
    const address = contractAddress({ workchain, initialCode: codeCell, initialData: dataCell });
    const stateInit = new StateInit({ code: codeCell, data: dataCell });

    return { address, stateInit, pkg };
  });

  return { data, error };
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

  // useEffect(() => {
  //   switch (data.status) {
  //     case "pending":
  //       sendAnalyticsEvent(AnalyticsAction.PUBLISH_CLICK);
  //       break;
  //     case "issued":
  //       sendAnalyticsEvent(AnalyticsAction.TRANSACTION_ISSUED);
  //       break;
  //     case "rejected":
  //       sendAnalyticsEvent(AnalyticsAction.TRANSACTION_REJECTED);
  //       break;
  //     case "error":
  //       sendAnalyticsEvent(AnalyticsAction.TRANSACTION_ERROR);
  //       break;
  //     case "expired":
  //       sendAnalyticsEvent(AnalyticsAction.TRANSACTION_EXPIRED);
  //       break;
  //     case "success":
  //       sendAnalyticsEvent(AnalyticsAction.CONTRACT_DEPLOYED);
  //       break;
  //   }
  // }, [data.status]);

  return {
    sendTXN: () => {
      if (!address) return;
      sendTXN(address, import.meta.env.DEV ? toNano(0.4) : toNano(0.5), undefined, stateInit);
    },
    status: data.status,
    clearTXN,
  };
}

export function TactDeployer() {
  const { restoreConnection } = useWalletConnect();

  useEffect(() => {
    restoreConnection();
  }, []);
  const { data, error } = useTactDeployer({ workchain: 0 });

  const { sendTXN, status } = useDeployContract(data?.stateInit, data?.address);

  return (
    <div>
      <TopBar />
      <div style={{ margin: "20px auto", maxWidth: 1160 }}>
        <h1>Tact Deployer - alpha (use at your own risk)</h1>
        {!!error && <div style={{ margin: "4px 0", color: "red" }}>{`${error}`}</div>}
        <div>Name: {data?.pkg.name}</div>
        <div>
          Will be deployed to:{" "}
          <a target="_blank" href={`/${data?.address.toFriendly()}`}>
            {data?.address.toFriendly()}
          </a>
        </div>
        <br />
        <button
          onClick={() => {
            sendTXN();
          }}>
          Deploy
        </button>
        {status !== "initial" && <div>{status}</div>}
      </div>
    </div>
  );
}
