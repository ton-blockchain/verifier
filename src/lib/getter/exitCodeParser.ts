import Parser from "web-tree-sitter";
import { createParser, initParser } from "./parser";

function findIntegersInNode(n: any) {
  if (n.type === "number_literal") return n.text;
  return n.children.flatMap((child: any) => findIntegersInNode(child));
}

function extractExitCodesFromNode(n: any, codes = new Set()) {
  n.children
    .flatMap((child: any) => {
      if (!child.text?.includes("throw")) return;

      if (
        child.type === "identifier" &&
        ["throw", "throw_if", "throw_unless"].includes(child.text)
      ) {
        const errorCode = findIntegersInNode(child.nextSibling)[0];
        if (errorCode) codes.add(errorCode);
      } else {
        extractExitCodesFromNode(child, codes);
      }
    })
    .filter((o: any) => !!o)
    .sort();

  return Array.from(codes).sort();
}

export async function parseExitCodes(code: string, parser: Parser) {
  // TODO move initparser
  // await initParser("./tree-sitter.wasm", "./tree-sitter-func.wasm");

  // Todo move
  const parsed = parser.parse(code);

  return extractExitCodesFromNode(parsed.rootNode);
}
