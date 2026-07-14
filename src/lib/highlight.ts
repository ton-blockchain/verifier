import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import cpp from "highlight.js/lib/languages/cpp";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import hljsFunc from "highlightjs-func";

let initialized = false;

function init() {
  if (initialized) return;
  hljsFunc(hljs);
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("typescript", typescript);
  hljs.registerLanguage("json", json);
  hljs.registerLanguage("bash", bash);
  hljs.registerLanguage("cpp", cpp);
  hljs.registerLanguage("python", python);
  hljs.registerLanguage("rust", rust);
  initialized = true;
}

export function highlightElement(element: HTMLElement) {
  init();
  hljs.highlightElement(element);
}

export function highlightAuto(code: string, languageSubset?: string[]) {
  init();
  return hljs.highlightAuto(code, languageSubset);
}

export { hljs };
