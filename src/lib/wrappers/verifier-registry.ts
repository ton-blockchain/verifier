import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
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

export function createSliceValue(): DictionaryValue<Slice> {
  return {
    serialize: (src, buidler) => {
      buidler.storeSlice(src);
    },
    parse: (src) => {
      return src;
    },
  };
}

export const Queries = {
  removeVerifier: (params: { queryId?: number; id: bigint }) => {
    let msgBody = beginCell();
    msgBody.storeUint(OperationCodes.removeVerifier, 32);
    msgBody.storeUint(params.queryId || 0, 64);
    msgBody.storeUint(params.id, 256);
    return msgBody.endCell();
  },
  updateVerifier: (params: {
    queryId?: number;
    id: bigint;
    quorum: number;
    endpoints: Map<bigint, number>;
    name: string;
    marketingUrl: string;
  }) => {
    let msgBody = beginCell();
    msgBody.storeUint(OperationCodes.updateVerifier, 32);
    msgBody.storeUint(params.queryId || 0, 64);
    msgBody.storeUint(params.id, 256);
    msgBody.storeUint(params.quorum, 8);

    let e = Dictionary.empty(Dictionary.Keys.BigUint(256), createSliceValue());
    params.endpoints.forEach(function (val: number, key: bigint) {
      e.set(key, beginCell().storeUint(val, 32).endCell().beginParse());
    });

    msgBody.storeDict(e);
    msgBody.storeRef(beginCell().storeBuffer(Buffer.from(params.name)).endCell());
    msgBody.storeRef(beginCell().storeBuffer(Buffer.from(params.marketingUrl)).endCell());

    return msgBody.endCell();
  },
  forwardMessage: (params: { queryId?: number; desc: Cell; signatures: Map<bigint, Buffer> }) => {
    let msgBody = beginCell();
    msgBody.storeUint(OperationCodes.forwardMessage, 32);
    msgBody.storeUint(params.queryId || 0, 64);
    msgBody.storeRef(params.desc);

    let signatures = beginCell().endCell();
    if (params.signatures.size > 0) {
      let signaturesBuilder = beginCell();
      params.signatures.forEach(function (val, key) {
        signaturesBuilder.storeBuffer(val);
        signaturesBuilder.storeUint(key, 256);

        let s = beginCell();
        s.storeRef(signaturesBuilder.endCell());
        signaturesBuilder = s;
      });
      signatures = signaturesBuilder.asSlice().loadRef();
    }

    msgBody.storeRef(signatures);

    return msgBody.endCell();
  },
};

export function buildMsgDescription(
  id: bigint,
  validTill: number,
  source: Address,
  target: Address,
  msg: Cell,
) {
  let desc = beginCell();
  desc.storeUint(id, 256);
  desc.storeUint(validTill, 32);
  desc.storeAddress(source);
  desc.storeAddress(target);
  desc.storeRef(msg);

  return desc;
}

export function buildRegistryDataCell(data: RegistryData, num?: number) {
  let dataCell = beginCell();
  let e = Dictionary.empty(Dictionary.Keys.BigUint(256), createSliceValue());
  data.verifiers.forEach(function (val: Verifier, key: bigint) {
    let x = beginCell().storeAddress(val.admin).storeUint(val.quorum, 8);

    let points = Dictionary.empty(Dictionary.Keys.BigUint(256), createSliceValue());
    val.pubKeyEndpoints.forEach(function (eVal: number, eKey: bigint) {
      points.set(eKey, beginCell().storeUint(eVal, 32).asSlice());
    });
    x.storeDict(points);
    x.storeRef(beginCell().storeBuffer(Buffer.from(val.name)).endCell());
    x.storeRef(beginCell().storeBuffer(Buffer.from(val.url)).endCell());
    e.set(key, x.asSlice());
  });

  if (num === undefined) {
    num = 0;
  }

  dataCell.storeDict(e).storeUint(num, 8);

  return dataCell.endCell();
}

export class VerifierRegistry implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new VerifierRegistry(address);
  }

  static createFromConfig(code: Cell, config: RegistryData, num?: number, workchain = 0) {
    let data = buildRegistryDataCell(config, num);
    const init = { code, data };
    return new VerifierRegistry(contractAddress(workchain, init), init);
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
