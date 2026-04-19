# Changelog

## v1.0.1

### Added

- Browser detection: Samsung Internet, DuckDuckGo, Puffin
- AI crawler detection: GPTBot, ClaudeBot, PerplexityBot, CCBot, AdsBot
- OS detection: Tizen, KaiOS
- Device type: `TV` (Smart TV)
- Headless detection: jsdom, Selenium, Playwright markers

### Fixed

- Android devices without `Mobile` marker were incorrectly classified as PC — now correctly identified as Tablet

### Docs

- Playground UI supports Chinese / English switching
- Full English documentation site (VitePress i18n)

---

## v1.0.0

### Added

- Bot detection: `isBot` and `botName` fields with 18+ major crawlers supported
- CPU architecture detection: `arch` field (`x86` / `x86_64` / `arm` / `arm64`)
- Headless browser detection: `isHeadless` field (HeadlessChrome, PhantomJS, Electron, Playwright)
- Named exports: `parseUA`, `detectBot`, `detectArch`, `detectHeadless` and more — tree-shakeable

### Changed

- `device: 'Pc'` → `device: 'PC'`
- `result.platfrom` → `result.platform` (typo fix)
- Removed `EnvPart` type — use `EnvOption` directly

### Refactored

- Architecture split into `constants/`, `detectors/`, `utils/` modules
- Pure function `parseUA()` replaces singleton class, eliminating state mutation
- Upgraded to TypeScript 5.x, migrated build tooling to tsup

---

## v0.1.9

Fixed edge-case UA parsing issues.

## v0.1.7

Added Webview detection support.

## v0.1.0

Initial release.
