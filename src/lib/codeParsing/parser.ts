import Parser from "web-tree-sitter";

let language: Parser.Language;

export const initParser = async (langUri: Buffer | string) => {
  if (language) {
    return;
  }
  const options: object | undefined = {
    // locateFile() {
    //   return treeSitterUri;
    // },
    // buffer: treeSitterUri,
  };

  await Parser.init();

  language = await Parser.Language.load(langUri);
};

export const createParser = () => {
  const parser = new Parser();
  parser.setLanguage(language);
  parser.setTimeoutMicros(1000 * 1000);
  return parser;
};
