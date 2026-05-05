# ua-browser

## 1.3.1

### Patch Changes

- Added `uaBrowser.detect()` async API with optimized `EnvContext` construction

## 1.3.0

### Minor Changes

- Removed miniapp runtime detection (`isWechatMiniapp` etc.) due to inconsistent web-view injection behavior across platforms; to be re-implemented after further validation

## 1.2.0

### Minor Changes

- Added detection for 7 mainstream app WebViews (Bilibili, Kuaishou, Xiaohongshu, Feishu, Toutiao, JD, Meituan). Added miniapp runtime detection across 6 platforms (WeChat, Alipay, Baidu, Douyin, QQ, Kuaishou). Added TV device type and Android tablet rules. Added Tizen/KaiOS OS detection. Added Samsung Internet/DuckDuckGo/Puffin browser detection. Added AI crawler detection (GPTBot, ClaudeBot, etc.). Removed 5 discontinued browsers.

## 1.1.0

### Minor Changes

- Introduced multi-signal fusion detection architecture (v1.1.0):

  - `getEnvContext()` collects all browser environment signals in one pass (WebGL, Client Hints, font probing, CSS media features)
  - `ParseOptions.ctx` feeds EnvContext into `parseUA()` for multi-signal detection
  - `parseHeaders()` + `ACCEPT_CH` constant for server-side HTTP Client Hints detection (SSR scenarios)
  - `detectArch()` upgraded to a 4-tier priority chain (Client Hints → WebGL → platform → UA string)
  - `isWebview()` now detects iOS WKWebView (complementing existing Android `;wv` logic)
  - HarmonyOS Next (5.0+) version extracted directly, no longer dependent on Android compatibility layer version
  - Added HarmonyOS version mapping (Android 11→3, 12→3, 13→4)
  - Added OpenHarmony OS detection (independent OsName)
  - Added ArkWeb engine detection

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
