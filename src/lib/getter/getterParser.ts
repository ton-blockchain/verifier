import Parser from "web-tree-sitter";
import { isWebAssemblySupported } from "../../utils/generalUtils";
import { sendAnalyticsEvent, AnalyticsAction } from "../googleAnalytics";

let language: Parser.Language;

export const initParser = async (treeSitterUri: string, langUri: string) => {
  if (language) {
    return;
  }
  const options: object | undefined = {
    locateFile() {
      return treeSitterUri;
    },
  };
  await Parser.init(options);
  language = await Parser.Language.load(langUri);
};

export const createParser = () => {
  const parser = new Parser();
  parser.setLanguage(language);
  parser.setTimeoutMicros(1000 * 1000);
  return parser;
};

type GetterParameter = {
  type: string;
  name: string;
};

export type Getter = {
  returnTypes: string[];
  name: string;
  parameters: GetterParameter[];
};

export async function parseGetters(code: string): Promise<Getter[]> {
  if (!isWebAssemblySupported()) {
    return [];
  }

  sendAnalyticsEvent(AnalyticsAction.GETTER_PARSE_START);

  await initParser("./tree-sitter.wasm", "./tree-sitter-func.wasm");
  const p = createParser();
  const parsed = p.parse(code);

  const getters = parsed.rootNode.children.filter(
    (c) =>
      c.type === "function_definition" && (
        // v0.4.x: `method_id` specifier
        c.children.find((n) => n.type === "specifiers_list")?.text.includes("method_id") ||
        // since v0.5.0: `get` on the left
        c.children.find((n) => n.type === "pre_specifiers_list")?.text.includes("get")
      ),
  );

  const gettersParsed = getters.map((f: Parser.SyntaxNode) => {
    return {
      returnTypes: f
        .childForFieldName("return_type")!
        .children.filter((c) => !c.type.match(/[,()]/)) // TODO types are slice, primitive_type, ",", "(", ")"
        .map((c) => c.text),
      name: f.childForFieldName("name")!.text,
      parameters: f
        .childForFieldName("arguments")!
        .children.filter((c) => c.type === "parameter_declaration")
        .map((c) => ({
          type: c.child(0)!.text,
          name: c.child(1)!.text,
        })),
    };
  });

  return gettersParsed;
}
