import { Address, Cell, StateInit, toNano, contractAddress } from "ton";
import { getClient } from "../../lib/getClient";
import { useSendTXN } from "../../lib/useSendTxn";
import { TopBar } from "../TopBar";
import { useWalletConnect } from "../../lib/useWalletConnect";
import { useEffect } from "react";

function useTactDeployer() {
  return {
    name: "Echo",
    code: "te6ccgECEAEAAmUAART/APSkE/S88sgLAQIBYgIDAojQAdDTAwFxsMABkX+RcOIB+kAiUFVvBPhh7UTQ1AH4YtIAAZIwbY6KgQEB1wABAdHbPOJZ2zwwMMj4QgHMfwHKAMntVA0EAgFYCwwDXu2i7ftwIddJwh+VMCDXCx/eApJbf+ABwACPEyDXScIfjwuAINch2zzbPH/bMeDeBQgGAULIcAHLH28AAW+MbW+MAds8byIByZMhbrOWAW8iWczJ6DEPAgrbPNs8fwcIAArIAc8WyQEm+EFvJBAjXwN/cFADgEIBbW3bPAkB9shxAcoBUAcBygBwAcoCUAXPFlAD+gJwAcpoI26zJW6zsY5MfwHKAMhwAcoAcAHKACRus51/AcoABCBu8tCAUATMljQDcAHKAOIkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDicAHKAAJ/AcoAAslYzJczMwFwAcoA4iFuswoAMJx/AcoAASBu8tCAAcyVMXABygDiyQH7AABxu70YJwXOw9XSyuex6E7DnWSoUbZoJwndY1LStkfLMi068t/fFiOYJwIFXAG4BnY5TOWDquRyWyw4Aj+4Ni7UTQ1AH4YtIAAZIwbY6KgQEB1wABAdHbPOIB2zyA0OAAQwbQJUMchvAAFvjG1vjIt0hlbGxvLCCNs8Ads8byIByZMhbrOWAW8iWczJ6DHQDw8AuiDXSiHXSZcgwgAiwgCxjkoDbyKAfyLPMasCoQWrAlFVtgggwgCcIKoCFdcYUDPPFkAU3llvAlNBocIAmcgBbwJQRKGqAo4SMTPCAJnUMNAg10oh10mScCDi4uhfAw==",
    abi: '{"name":"Echo","types":[{"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},{"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},{"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]}],"receivers":[{"receiver":"internal","message":{"kind":"text"}},{"receiver":"internal","message":{"kind":"any"}}],"getters":[{"name":"hello","arguments":[{"name":"src","type":{"kind":"simple","type":"string","optional":false}}],"returnType":{"kind":"simple","type":"string","optional":false}}],"errors":{"2":{"message":"Stack undeflow"},"3":{"message":"Stack overflow"},"4":{"message":"Integer overflow"},"5":{"message":"Integer out of expected range"},"6":{"message":"Invalid opcode"},"7":{"message":"Type check error"},"8":{"message":"Cell overflow"},"9":{"message":"Cell underflow"},"10":{"message":"Dictionary error"},"13":{"message":"Out of gas error"},"32":{"message":"Method ID not found"},"34":{"message":"Action is invalid or not supported"},"37":{"message":"Not enough TON"},"38":{"message":"Not enough extra-currencies"},"128":{"message":"Null reference exception"},"129":{"message":"Invalid serialization prefix"},"130":{"message":"Invalid incoming message"},"131":{"message":"Constraints error"},"132":{"message":"Access denied"},"133":{"message":"Contract stopped"},"134":{"message":"Invalid argument"},"135":{"message":"Code of a contract was not found"},"136":{"message":"Invalid address"}}}',
    init: {
      kind: "direct",
      args: [{ name: "a", type: { kind: "simple", type: "int", optional: false, format: 257 } }],
      prefix: { bits: 1, value: 0 },
      deployment: {
        kind: "system-cell",
        system:
          "te6cckECEgEAAm8AAQHAAQEFoB5RAgEU/wD0pBP0vPLICwMCAWIIBAIBWAcFAj+4Ni7UTQ1AH4YtIAAZIwbY6KgQEB1wABAdHbPOIB2zyBEGAlQxyG8AAW+MbW+Mi3SGVsbG8sII2zwB2zxvIgHJkyFus5YBbyJZzMnoMdAQEABxu70YJwXOw9XSyuex6E7DnWSoUbZoJwndY1LStkfLMi068t/fFiOYJwIFXAG4BnY5TOWDquRyWyw4AojQAdDTAwFxsMABkX+RcOIB+kAiUFVvBPhh7UTQ1AH4YtIAAZIwbY6KgQEB1wABAdHbPOJZ2zwwMMj4QgHMfwHKAMntVBEJA17tou37cCHXScIflTAg1wsf3gKSW3/gAcAAjxMg10nCH48LgCDXIds82zx/2zHg3g8MCgIK2zzbPH8LDAAKyAHPFskBJvhBbyQQI18Df3BQA4BCAW1t2zwNAfbIcQHKAVAHAcoAcAHKAlAFzxZQA/oCcAHKaCNusyVus7GOTH8BygDIcAHKAHABygAkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDiJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4nABygACfwHKAALJWMyXMzMBcAHKAOIhbrMOADCcfwHKAAEgbvLQgAHMlTFwAcoA4skB+wABQshwAcsfbwABb4xtb4wB2zxvIgHJkyFus5YBbyJZzMnoMRAAuiDXSiHXSZcgwgAiwgCxjkoDbyKAfyLPMasCoQWrAlFVtgggwgCcIKoCFdcYUDPPFkAU3llvAlNBocIAmcgBbwJQRKGqAo4SMTPCAJnUMNAg10oh10mScCDi4uhfAwAEMG1AhbVT",
      },
    },
    sources: {
      "examples/echo.tact":
        "Y29udHJhY3QgRWNobyB7CgogICAgaW5pdChhOiBJbnQpIHsKICAgICAgICAKICAgIH0KICAgIAogICAgcmVjZWl2ZShtc2c6IFN0cmluZykgewogICAgICAgIHJlcGx5KG1zZy5hc0NvbW1lbnQoKSk7CiAgICB9CiAgICAKICAgIHJlY2VpdmUobXNnOiBTbGljZSkgewogICAgICAgIHJlcGx5KG1zZy5hc0NlbGwoKSk7CiAgICB9CgogICAgZ2V0IGZ1biBoZWxsbyhzcmM6IFN0cmluZyk6IFN0cmluZyB7CiAgICAgICAgbGV0IGJ1aWxkZXI6IFN0cmluZ0J1aWxkZXIgPSBiZWdpblN0cmluZygpOwogICAgICAgIGJ1aWxkZXIuYXBwZW5kKCJIZWxsbywgIik7CiAgICAgICAgYnVpbGRlci5hcHBlbmQoc3JjKTsKICAgICAgICByZXR1cm4gYnVpbGRlci50b1N0cmluZygpOwogICAgfQp9",
    },
    compiler: {
      name: "tact",
      version: "1.0.0-rc.7",
      parameters: '{"entrypoint":"./examples/echo.tact","options":{}}',
    },
  };
}

function useDeployContract(stateInit: StateInit, address: Address) {
  const { sendTXN, data, clearTXN } = useSendTXN("deployContract", async (count: number) => {
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

  // TODO remove the cell
  return {
    sendTXN: () => {
      sendTXN(address, import.meta.env.DEV ? toNano(0.1) : toNano(0.5), new Cell(), stateInit);
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
  const { name, code, abi, sources } = useTactDeployer();

  const codeCell = Cell.fromBoc(Buffer.from(code, "base64"))[0];
  const dataCell = new Cell();
  const si = new StateInit({ code: codeCell, data: dataCell });

  const addr = contractAddress({ workchain: 0, initialCode: codeCell, initialData: dataCell });

  const { sendTXN, status } = useDeployContract(si, addr);

  return (
    <div>
      <TopBar />
      <div>{name}</div>
      <div>{code?.slice(0, 100)}</div>
      <div>{codeCell.hash().toString("base64")}</div>
      <div>{status}</div>
      <div>
        <a href={addr.toFriendly()}>{addr.toFriendly()}</a>
      </div>
      <button
        onClick={() => {
          sendTXN();
        }}>
        Deploy
      </button>
    </div>
  );
}
