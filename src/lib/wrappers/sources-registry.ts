import {
  Address,
  beginCell,
  Cell,
  Contract,
  ContractProvider,
  fromNano,
  Sender,
  SendMode,
} from "ton-core";

import { toBigIntBE } from "bigint-buffer";
import { Sha256 } from "@aws-crypto/sha256-js";

export const toSha256Buffer = (s: string) => {
  const sha = new Sha256();
  sha.update(s);
  return Buffer.from(sha.digestSync());
};

export class SourcesRegistry implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new SourcesRegistry(address);
  }

  async sendInternalMessage(provider: ContractProvider, via: Sender, body: Cell, value: bigint) {
    await provider.internal(via, {
      value: value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: body,
    });
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint, bounce = true) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
      bounce,
    });
  }

  async getChildAddressFromChain(
    provider: ContractProvider,
    verifier: string,
    codeCellHash: string,
  ): Promise<Address> {
    const result = await provider.get("get_source_item_address", [
      {
        type: "int",
        value: toBigIntBE(toSha256Buffer(verifier)),
      },
      {
        type: "int",
        value: toBigIntBE(Buffer.from(codeCellHash, "base64")),
      },
    ]);
    const item = result.stack.readCell();

    return item.beginParse().loadAddress()!;
  }

  async getVerifierRegistryAddress(provider: ContractProvider): Promise<Address> {
    const res = await provider.get("get_verifier_registry_address", []);
    const item = res.stack.readCell();
    return item.beginParse().loadAddress();
  }

  async getAdminAddress(provider: ContractProvider) {
    const res = await provider.get("get_admin_address", []);
    const item = res.stack.readCell();
    return item.beginParse().loadMaybeAddress();
  }

  async getCodeOpt(provider: ContractProvider) {
    const state = await provider.getState();
    if (state.state.type != "active") return null;
    return state.state.code;
  }

  async getDeploymentCosts(provider: ContractProvider) {
    const res = await provider.get("get_deployment_costs", []);
    const min = res.stack.readBigNumber();
    const max = res.stack.readBigNumber();
    return { min: fromNano(min), max: fromNano(max) };
  }
}
