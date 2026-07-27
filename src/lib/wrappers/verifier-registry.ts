import { toBufferBE } from "bigint-buffer";
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
} from "@ton/core";

export type Verifier = {
  admin: Address;
  quorum: number;
  pubKeyEndpoints: Record<string, string>;
  name: string;
  url: string;
};

export type VerifierWithId = Verifier & { id: string };

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

function num2ip(num: bigint) {
  let d = toBufferBE(num, 4);
  return [d[0].toString(), d[1].toString(), d[2].toString(), d[3].toString()].join(".");
}

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
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

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

  async getVerifiers(provider: ContractProvider): Promise<Record<string, VerifierWithId>> {
    let res = await provider.get("get_verifiers", []);
    const item = res.stack.readCell();
    const c = item.beginParse();
    const d = c.loadDict(Dictionary.Keys.BigUint(256), createSliceValue());

    return Array.from(d).reduce<Record<string, VerifierWithId>>((acc, [id, slice]) => {
      const admin = slice.loadAddress()!;
      const quorom = slice.loadUint(8);
      const pubKeyEndpoints = slice.loadDict(
        Dictionary.Keys.BigUint(256),
        Dictionary.Values.BigUint(32),
      );

      // NOTE: no name in lists of contracts, no source code for orbs contracts
      // const name = slice.loadRef().beginParse().loadStringTail();
      //
      // if (name.includes('orbs')) {
      //   return acc
      // }

      const verifierId = `0x${id.toString(16).padStart(64, "0")}`;

      acc[verifierId] = {
        id: verifierId,
        admin: admin,
        quorum: quorom,
        pubKeyEndpoints: Object.fromEntries(
          Array.from(pubKeyEndpoints).map(([k, v]) => {
            return [toBufferBE(k, 32).toString("base64"), num2ip(v)];
          }),
        ),
        name: slice.loadRef().beginParse().loadStringTail(),
        url: slice.loadRef().beginParse().loadStringTail(),
      };
      return acc;
    }, {});
  }
}
