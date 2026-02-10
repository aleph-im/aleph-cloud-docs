# Architecture

Technical patterns and decisions.

---

## Stack

- **Static site generator:** VitePress 1.6.3 (Vue 3.5.13)
- **Math rendering:** markdown-it-mathjax3
- **Link validation:** Custom `scripts/links.js`
- **Formatting:** Prettier

---

## Project Structure

| Directory | Purpose |
|-----------|---------|
| `docs/` | All documentation source (markdown + VitePress config) |
| `docs/.vitepress/` | VitePress config, theme customizations, build output |
| `docs/.vitepress/theme/` | Custom Vue components and CSS overrides |
| `docs/assets/images/` | All images, organized by topic subdirectory |
| `docs/about/` | About Aleph Cloud — overview, network, use cases |
| `docs/nodes/` | Node operator guides — setup, staking, resources |
| `docs/devhub/` | Developer hub — SDKs, APIs, tutorials, examples |
| `docs/plans/` | Design and implementation plans (read-only reference) |
| `scripts/` | Build-time scripts (version, links, deploy) |

---

## Build Pipeline

The production build runs three stages in sequence:

1. **`scripts/links.js --prompt`** — Scans all markdown for broken internal links and missing images. Halts the build (or prompts) if any are found.
2. **`scripts/version.js`** — Writes the current git commit hash and version to `docs/.vitepress/version.json` and `docs/public/version.json` for the footer display.
3. **`vitepress build docs`** — Compiles the site to `docs/.vitepress/dist/`.

Local dev (`npm run docs:dev`) skips link checking and only runs version + VitePress dev server.

---

## Asset Strategy

- All images use **absolute paths** (`/assets/images/...`) to ensure consistent rendering across dev and production.
- Images are organized under `docs/assets/images/` in topic-based subdirectories.
- The link checker validates image paths during build.

---

## Patterns

### Protocol Documentation from IPFS Sources
**Date:** 2026-02-09
**Context:** Protocol-level documentation lives on IPFS and needs to be integrated into the VitePress docs.
**Approach:** Content from IPFS sources is adapted to match existing doc style (no frontmatter, standard markdown headers, tables for field descriptions). Constructed examples should be flagged for team review when not present in the source.
**Key files:** `docs/devhub/building-applications/messaging/permissions.md`
**Notes:** Sidebar config in `docs/.vitepress/config.mts` must be updated if new pages are added. Existing pages just need content updates.
