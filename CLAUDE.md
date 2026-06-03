# ua-browser

Zero-dependency TypeScript library for detecting browser, OS, engine, and device type from User-Agent strings and browser environment signals. Supports both browser and Node.js environments.

## Commands

```bash
pnpm build            # clean dist/ → ESM + CJS + IIFE bundles
pnpm test             # Vitest, node environment
pnpm typecheck        # tsc --noEmit
pnpm lint
```

Run a single test file: `pnpm test browser` (Vitest matches by filename substring).

## Git Rules

- All PRs target `dev`, never `main` directly
- Branch names: `feat/xxx`, `fix/xxx`, `docs/xxx` — no `claude` or `ai` in the name
- Never push directly to `dev` or `main`
- Releases: `npx changeset` → `npx changeset version` → PR from `dev` to `main`

## Architecture

Detection pipeline in `src/parse.ts`: calls `detectBrowser` → `detectEngine` → `detectOs` → `detectDevice`, then applies post-detection overrides (360 MIME, Wechat Miniapp, Firefox Nightly, etc.).

`src/constants/browsers.ts` is the most important file. Each `BrowserDef` has a `priority` field — highest wins when multiple entries match the same UA. App webviews (Wechat, DingTalk…) are 500+ to beat generic Chrome. **Adding a browser = one entry here + `BrowserName` union in `types.ts`.**

`src/detectors/device.ts` always uses hardware signals first (`hwDetect() ?? uaDetect()`), falling back to UA-only detection when no nav context is available.

All detection returns `'unknown'` on failure — never empty string or `null`.

## Adding a New Browser

1. Add UA fixture to `test/fixtures/user-agents.ts`
2. Add `BrowserDef` to `src/constants/browsers.ts`
3. Add name to `BrowserName` union in `src/types.ts`
4. Add test in `test/browser.test.ts`
