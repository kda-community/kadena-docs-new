# AGENTS.md — Working Agreement for AI Agents (kadena-docs-new)

Scope: this repository — the Kadena Docs Docusaurus site. Goal: let agents help **without breaking the build, the theme, or the content**. Read this before editing anything.

## Golden rules (do not violate)

1. **Never modify build/config files without explicit human approval.** Treat these as load-bearing:
   `docusaurus.config.ts`, `sidebars.ts`, `package.json`, `package-lock.json`, `tsconfig.json`,
   `babel.config.js`, `vercel.json`, `src/css/custom.css`.
   A wrong edit breaks the build (`onBrokenLinks`/`onBrokenAnchors` are `throw`) or silently changes
   routing, canonicals, or appearance.
2. **Double-confirmation rule for config changes.** If a config change is truly required: **STOP**. Present
   (a) the exact file and hunk, (b) why it is needed, (c) the risk, (d) the rollback. Obtain **two separate
   explicit confirmations** from the operator before making the edit.
3. **Never run destructive commands:** `docusaurus clear`, `rm -rf`, `git reset --hard`, `git clean -fd`,
   force-push. Never delete or rename content files.
4. **Preserve content and appearance.** Do not rewrite docs prose, delete/rename pages, or change
   theme/visual/CSS unless explicitly requested.
5. **Keep diffs minimal and surgical.** No reformatting, reflowing, or mass rewrites.
6. **Check for in-flight work first.** `git fetch`, then look at open PRs/branches — someone else may be
   editing the same files (for example, frontmatter descriptions). Do not duplicate or conflict with them.
7. **Never commit or push unless the operator asks.**

## This repo in context

- Docusaurus 3.x, TypeScript config. `url: https://kda-chain.org/`, `baseUrl: /docs/`,
  `trailingSlash: false`, docs `routeBasePath: /` (docs live under `/docs/...`).
- It is **not** deployed on Vercel (`vercel.json` is legacy and a no-op on GitHub Pages). It is built and
  copied into the main website's `/docs` path by the `publish.yaml` workflow in
  `kda-community.github.io`, which checks out this repo's **default branch**. Merging to `main` is what
  reaches production (publishing itself is a manual/manual-triggered workflow).
- **`docs/pact-5/**` is regenerated on every deploy** from the `pact-5` repo (builtins copied in, filenames
  lowercased, headings rewritten). Do not hand-edit `docs/pact-5/**` — changes there are overwritten.
- No `i18n`, no versioned docs, no blog (single locale `en`).

## Before proposing a change

- Validate locally with `npm run build` — it must succeed; broken links/anchors fail the build. There is no
  test suite.
- Prefer **metadata-only or additive** edits for SEO work (frontmatter `title`, `description`, `tags`);
  never structural or visual ones.

## SEO-sensitive invariants

- Canonical URLs are the **no-trailing-slash** form (`/docs/...`). Do not enable `trailingSlash`.
- Tag slugs derive from labels: `TypeScript` → `/docs/tags/type-script`, `typescript` → `/docs/tags/typescript`.
  Keep a **single canonical label per concept** so duplicate tag pages are not created.
- Frontmatter `description` is the meta description. Keep it unique and factual.

## Verification checklist

1. `npm run build`, then inspect the generated routes for anything you touched.
2. `git diff` review — only the intended hunks.
3. Nothing is committed or pushed without an explicit request.
