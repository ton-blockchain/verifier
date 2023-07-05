import {
  Address,
  beginCell,
  Cell,
  Contract,
  ContractProvider,
  Sender,
  SendMode,
  Dictionary,
  DictionaryValue,
  Slice,
} from "ton-core";

export type RegistryData = {
  verifiers: Map<bigint, Verifier>;
};

export type Verifier = {
  admin: Address;
  quorum: number;
  pubKeyEndpoints: Map<bigint, number>;
  name: string;
  url: string;
};

export const OperationCodes = {
  removeVerifier: 0x19fa5637,
  updateVerifier: 0x6002d61a,
  forwardMessage: 0x75217758,
};

export type CollectionMintItemInput = {
  passAmount: bigint;
  index: number;
  ownerAddress: Address;
  content: string;
};

function createSliceValue(): DictionaryValue<Slice> {
  return {
    serialize: (src, buidler) => {
      buidler.storeSlice(src);
    },
    parse: (src) => {
      return src;
    },
  };
}

export class VerifierRegistry implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new VerifierRegistry(address);
  }

  async sendInternalMessage(provider: ContractProvider, via: Sender, body: Cell, value: bigint) {
    await provider.internal(via, {
      value: value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: body,
    });
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async getVerifier(
    provider: ContractProvider,
    id: bigint,
  ): Promise<{ admin: Address | null; settings: Cell | null }> {
    let res = await provider.get("get_verifier", [
      {
        type: "int",
        value: id,
      },
    ]);
    const sl = res.stack.readCell();
    const settings = res.stack.readCellOpt();
    const ok = res.stack.readNumber();
    if (ok == 0) {
      return {
        admin: null,
        settings: null,
      };
    }

    return {
      admin: sl.beginParse().loadAddress(),
      settings,
    };
  }

  async getVerifiersNum(provider: ContractProvider): Promise<number> {
    let res = await provider.get("get_verifiers_num", []);
    let num = res.stack.readNumber();

    return num;
  }

  async getVerifiers(provider: ContractProvider): Promise<Verifier[]> {
    let res = await provider.get("get_verifiers", []);
    const item = res.stack.readCell();
    const c = item.beginParse();
    const d = c.loadDict(Dictionary.Keys.BigUint(256), createSliceValue());

    return Array.from(d.values()).map((v) => {
      const admin = v.loadAddress()!;
      const quorom = v.loadUint(8);
      const pubKeyEndpoints = v.loadDict(Dictionary.Keys.BigUint(256), Dictionary.Values.Uint(32));

      return {
        admin: admin,
        quorum: quorom,
        pubKeyEndpoints: new Map<bigint, number>(
          Array.from(pubKeyEndpoints).map(([k, v]) => [k, v]),
        ),
        name: v.loadRef().beginParse().loadStringTail(),
        url: v.loadRef().beginParse().loadStringTail(),
      };
    });
  }
}
