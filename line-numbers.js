// Add a line-number gutter to multi-line code blocks.
for (const code of document.querySelectorAll("article pre > code")) {
  const lines = code.textContent.replace(/\n$/, "").split("\n").length;
  if (lines < 2) continue;
  const gutter = document.createElement("span");
  gutter.className = "line-numbers";
  gutter.setAttribute("aria-hidden", "true");
  gutter.textContent = Array.from({ length: lines }, (_, i) => i + 1).join("\n");
  code.parentElement.classList.add("numbered");
  code.parentElement.prepend(gutter);
}
