import { createParser, initParser } from "./parser";

export async function parseExitCodes(code: string) {
  // TODO move initparser
  await initParser("./tree-sitter.wasm", "./tree-sitter-func.wasm");

  // Todo move
  const p = createParser();
  const parsed = p.parse(code);

  return [];
}
