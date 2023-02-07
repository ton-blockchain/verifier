import { toNano } from "ton";
import Parser from "web-tree-sitter";
import { create } from "zustand";
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

export type GetterParameter = {
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

  language = p.getLanguage();

  const getters = parsed.rootNode.children.filter(
    (c) =>
      c.type === "function_definition" &&
      c.children.find((n) => n.type === "specifiers_list")?.text.includes("method_id"),
  );

  const gettersParsed = getters.map((f) => {
    const returnTypes = f.children[0].children
      .filter((c) => !c.type.match(/[,()]/)) // TODO types are slice, primitive_type, ",", "(", ")"
      .map((c) => c.text);

    const name = f.children.find((n) => n.type === "function_name")!.text;

    const parameters = f.children
      .find((n) => n.type === "parameter_list")!
      .children.filter((c) => c.type === "parameter_declaration")
      .map((c) => ({
        type: c.child(0)!.text,
        name: c.child(1)!.text,
      }));

    return {
      returnTypes,
      name,
      parameters,
    };
  });

  return gettersParsed;
}
