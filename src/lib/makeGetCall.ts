import {
  Address,
  Cell,
  TonClient,
  TupleBuilder,
  TupleItemCell,
  TupleReader,
  Tuple,
  TupleItemInt,
} from "ton";

function _prepareParams(params: any[] = []) {
  const paramsTuple = new TupleBuilder();
  params.forEach((p) => {
    if (p instanceof Cell) {
      paramsTuple.writeSlice(p);
    } else if (typeof p === "bigint") {
      paramsTuple.writeNumber(p);
    } else {
      throw new Error("unknown type!");
    }
  });
  return paramsTuple.build();
}

type GetResponseValue = Cell | bigint | null;

function _parseGetMethodCall(stack: TupleReader): GetResponseValue[] {
  const parsedItems: GetResponseValue[] = [];
  while (stack.remaining) {
    const item = stack.pop();
    switch (item.type) {
      case "int": {
        parsedItems.push((item as TupleItemInt).value);
        break;
      }
      case "cell": {
        parsedItems.push((item as TupleItemCell).cell);
        break;
      }
      case "tuple": {
        if ((item as Tuple).items.length === 0) {
          parsedItems.push(null);
        } else {
          throw new Error("list parsing not supported");
        }
        break;
      }
      default: {
        throw new Error(`unknown type: ${item.type}`);
      }
    }
  }
  return parsedItems;
}

export async function makeGetCall<T>(
  address: Address | undefined,
  name: string,
  params: any[],
  parser: (stack: GetResponseValue[]) => T,
  tonClient: TonClient,
) {
  const { stack } = await tonClient.runMethod(address!, name, _prepareParams(params));
  return parser(_parseGetMethodCall(stack));
}
