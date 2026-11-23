# david-bach.com

Built with [Zine](https://zine-ssg.io/), a static site generator written in
Zig. Julia and Node.js are not required.

## Local development

Download **Zine 0.14.1** for your platform from
[the release page](https://github.com/kristoff-it/zine/releases/tag/v0.14.1)
and put the `zine` executable on your `PATH`.

```sh
zine
```

Open the local URL printed by the development server. Changes reload automatically.

## Production build

```sh
zine release
```

The generated site is in `public/`. For subsequent builds, remove that generated
directory first: `--force` overwrites files but does not remove stale output.
GitHub Actions builds pull requests and deploys pushes to `main` or `master`
to the existing `gh-pages` branch.

## Editing

- `content/`: pages and posts in SuperMD, with Ziggy frontmatter.
- `layouts/`: SuperHTML templates based on Zine's starter layout.
- `assets/style.css`: the book-like light theme inspired by matklad.github.io.
- `assets/fonts/`: self-hosted EB Garamond, Open Sans, and JetBrains Mono
  (Fontsource 5.3.0, Latin subsets), with their OFL licenses.
- `assets/highlight.css`: the custom light syntax palette shared by Zine and highlight.js.
- `assets/assets/pages/`: original images and slides, retaining `/assets/pages/` URLs.
- `assets/CNAME`: the custom domain.
- `zine.ziggy`: site configuration and pinned Zine version.

Existing `/pages/…/index.html` URLs still work. The Ideas list is kept manually
in `content/pages/ideas.smd`. The post section generates `/feed.xml`.
Math uses Zine's starter Temml integration. Zig and Rust highlighting happens
at build time. Clojure uses a locally vendored highlight.js 11.11.1 core and
grammar in the browser because this Zine release does not include a Clojure
grammar. No CDN or Node.js is needed to build or serve the site.

For a Clojure post, add `.custom = .{ .plain_code_language = "clojure" },`
to its frontmatter and use untyped code fences. The fallback highlights only
those fences on opted-in pages; Zine's highlighted blocks are left alone.
Without JavaScript, the snippets remain readable as plain code.
