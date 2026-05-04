# ua-browser

## 1.1.0

### Minor Changes

- 新增多信号融合检测架构（v1.1.0）：

  - `getEnvContext()` 一次性采集所有浏览器环境信号（WebGL、Client Hints、字体探针、CSS media features）
  - `ParseOptions.ctx` 新选项，将 EnvContext 传入 parseUA() 以启用多信号检测
  - `parseHeaders()` + `ACCEPT_CH` 常量：服务端通过 HTTP Client Hints 头部实现精准检测（SSR 场景）
  - `detectArch()` 升级为四层优先级链（Client Hints → WebGL → platform → UA 字符串）
  - `isWebview()` 新增 iOS WKWebView 检测（补充 Android `;wv` 现有逻辑）
  - HarmonyOS Next（5.0+）版本直接提取，无需依赖 Android 兼容层版本号
  - 新增 HarmonyOS 版本映射（Android 11→3、12→3、13→4）
  - 新增 OpenHarmony OS 检测（独立 OsName）
  - 新增 ArkWeb 引擎检测

## 1.0.2

### Patch Changes

- Fix OS detection order bugs and iOS Safari version parsing

  - Fix Chrome OS misidentified as Linux (Chrome OS UA contains X11)
  - Fix HarmonyOS misidentified as Android (HarmonyOS UA contains Android)
  - Fix Windows Phone misidentified as Windows (Windows Phone UA contains Windows)
  - Fix iOS 26+ Safari osVersion showing frozen value (18.7) instead of real version from Version/ token
  - Fix Playground mobile layout: reduce padding for two-column result grid on small screens

## 1.0.1

### Patch Changes

- Added browser, bot, and OS detection support; improved docs and i18n

  - Added browser detection: Samsung Internet, DuckDuckGo, Puffin
  - Added AI bot detection: GPTBot, ClaudeBot, PerplexityBot, CCBot, AdsBot
  - Added OS detection: Tizen, KaiOS
  - Added device type: TV (Smart TV); fixed Android tablet misidentification
  - Added headless detection markers: jsdom, Selenium, Playwright
  - Playground supports Chinese / English UI switching
  - Added full English VitePress documentation site (i18n)

## 1.0.0

### Major Changes

**Full architecture rewrite — modular pure-function design.**

#### Breaking Changes

- `result.platfrom` (typo) renamed to `result.platform`
- Removed `EnvPart` type — use `EnvOption` directly
- Removed singleton class — replaced by pure function `parseUA(ua, options?)`

#### New Features

- **`parseUA(ua, options?)`** — pure function, ideal for SSR / Node.js
- **`getNavContext()`** — reads real `navigator`, safely degrades in Node.js
- **`getWindowsVersion(nav)`** — async accurate Windows 10 / 11 detection
- **`detectBot(ua)`** — standalone bot detector, returns `{ isBot, botName }`
- **`detectArch(ua)`** — standalone CPU architecture detector
- **`detectHeadless(ua)`** — standalone headless browser detector
- **`getLanguage(nav)`** — extracts normalized language code from `NavContext`
- **`VERSION`** — exports current library version
- Named exports with tree-shaking support
- `NavContext` injection eliminates global side effects; all detectors testable in Node.js

#### Detection Enhancements

- Added browsers: Samsung Internet, DuckDuckGo, Puffin
- Added OS: Tizen, KaiOS
- Added device type: `TV` (Smart TV)
- Android without `Mobile` marker now correctly identified as Tablet
- Added AI bot detection: GPTBot, ClaudeBot, PerplexityBot, CCBot, AdsBot
- Added headless markers: jsdom, Selenium, Playwright

#### Build System

- Migrated from Rollup + Babel + shelljs to **tsup + TypeScript 5**
- Output formats: ESM (`.mjs`), CommonJS (`.cjs`), IIFE (`.min.js`), type declarations (`.d.ts` / `.d.cts`)
- Added **Vitest** test suite

---

## 0.1.9

### Patch Changes

- Fixed version parsing edge cases
