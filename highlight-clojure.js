import hljs from "./vendor/highlight/core.min.js";
import clojure from "./vendor/highlight/clojure.min.js";

hljs.registerLanguage("clojure", clojure);

// Only opt-in pages and untyped fences: leave Zine's highlighted code alone.
for (const code of document.querySelectorAll(
  'article[data-plain-code-language="clojure"] pre > code:not([class])',
)) {
  code.classList.add("language-clojure");
  hljs.highlightElement(code);
}
