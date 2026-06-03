# ua-browser

[![npm version](https://img.shields.io/npm/v/ua-browser?color=cb3837)](https://www.npmjs.com/package/ua-browser)
[![npm downloads](https://img.shields.io/npm/dm/ua-browser)](https://www.npmjs.com/package/ua-browser)
[![license](https://img.shields.io/npm/l/ua-browser)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6)](https://www.typescriptlang.org/)

Detect browser, OS, device type, rendering engine, CPU architecture, bots, headless browsers, and Mini Programs from User Agent strings. Zero dependencies. Works in both browser and Node.js environments.

**[📖 Documentation](https://yangtianxia.github.io/ua-browser/)** · **[🎮 Playground](https://yangtianxia.github.io/ua-browser/playground)** · **[中文](./README.md)**

## Features

- **Comprehensive UA detection** — browser (incl. Arc / Brave), OS (incl. visionOS / tvOS), engine, device type (Mobile / Tablet / PC / TV / Console / XR), CPU arch, bots, headless browsers
- **Robust device detection** — hardware signals (WebGL GPU renderer, CSS safe-area-inset, DPR, vibration/motion APIs) correctly identify mobile devices even when desktop mode is enabled
- **Multi-signal arch detection** — `getEnvContext()` collects Client Hints, WebGL renderer, and font probes to accurately distinguish Apple Silicon from Intel Mac
- **SSR Client Hints** — `parseHeaders()` + `ACCEPT_CH` for precise server-side detection (CPU arch, platform) in Chrome / Edge 90+
- **AI bot recognition** — 40+ built-in bot rules: GPTBot, ClaudeBot, PerplexityBot, CCBot, messaging link-preview bots (Slack, Discord, Telegram, WhatsApp), and more
- **Condition matching** — `satisfies(info, { os: 'iOS', device: 'Mobile' })` helper with TypeScript type checking
- **Zero dependencies** — no runtime dependencies, tiny bundle size after gzip
- **Pure function** — `parseUA()` has no global state, works seamlessly with SSR / Node.js
- **TypeScript** — full type definitions with precise literal union types (`BrowserName`, `OsName`, etc.)
- **Tree-shakeable** — named exports + `sideEffects: false`, unused code eliminated by Vite / Rollup / webpack 5+

## Installation

```sh
npm i ua-browser
# pnpm
pnpm add ua-browser
# yarn
yarn add ua-browser
```

## Quick Start

```typescript
import uaBrowser from 'ua-browser'

const info = uaBrowser()

console.log(info)
// {
//   browser:        'Chrome',
//   version:        '124.0.0.0',
//   versionMajor:   124,
//   engine:         'Blink',
//   os:             'Windows',
//   osVersion:      '10',
//   device:         'PC',
//   arch:           'x86_64',
//   isWebview:      false,
//   isHeadless:     false,
//   isBot:          false,
//   botName:        'unknown',
//   language:       'en-US',
//   platform:       'Win32',
//   connectionType: 'unknown'
// }
```

> To parse an arbitrary UA string, use the named export: `parseUA('Mozilla/5.0 ...')`

## Usage

### Browser (recommended: `detect`)

Use `detect()` for accurate device and arch detection — it collects hardware signals in addition to parsing the UA string:

```typescript
import uaBrowser from 'ua-browser'

const result = await uaBrowser.detect()
console.log(result.device) // 'Mobile' — correct even in desktop mode
console.log(result.arch)   // 'arm64' or 'x86_64'

if (result.device === 'Mobile') {
  // redirect to mobile version
}
```

### Browser (sync: `uaBrowser`)

```typescript
import uaBrowser from 'ua-browser'

const { browser, os, device } = uaBrowser()

if (device === 'Mobile') {
  // redirect to mobile version
}
```

### Node.js / SSR

```typescript
import { parseUA } from 'ua-browser'

const ua = req.headers['user-agent'] ?? ''
const { browser, os, isBot } = parseUA(ua)

if (isBot) {
  // block or allow crawlers
}
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/ua-browser/dist/index.min.js"></script>
<script>
  const { browser, os } = uaBrowser()
</script>
```

### Multi-signal Detection

`getEnvContext()` collects Client Hints, WebGL renderer, and other browser signals in one async call. Use it when you need to reuse the context object or compose it with other options:

```typescript
import { getEnvContext, parseUA } from 'ua-browser'

const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx })

console.log(result.device) // 'Mobile' — correct even in desktop mode
console.log(result.arch)   // 'arm64' or 'x86_64'
```

### SSR Client Hints

Set the `ACCEPT_CH` response header so Chrome / Edge 90+ browsers send Client Hints on subsequent requests, then use `parseHeaders` for precise server-side detection:

```typescript
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

// First response — tell the browser to send Client Hints
res.setHeader('Accept-CH', ACCEPT_CH)

// Subsequent requests — accurate arch / OS detection
const result = parseHeaders(req.headers)
console.log(result.arch) // 'x86_64' (from Sec-CH-UA-Arch)
```

### Accurate Windows 10 / 11 Detection

Windows 10 and 11 share the same UA string. Use the Client Hints API to distinguish them:

```typescript
import { parseUA, getWindowsVersion, getNavContext } from 'ua-browser'

const nav = getNavContext()
const windowsVersion = await getWindowsVersion(nav)
const result = parseUA(navigator.userAgent, { nav, windowsVersion })

console.log(result.osVersion) // '10' or '11'
```

## API

### Default export `uaBrowser()`

Detects the current browser environment, automatically injecting the `navigator` context (language, platform, MIME types, etc.).

```typescript
uaBrowser()         // reads navigator.userAgent automatically
parseUA(customUA)   // parse any UA string without browser context
```

### Named exports (tree-shakeable)

```typescript
import {
  parseUA,              // pure function, ideal for SSR / Node.js
  getNavContext,        // read current browser navigator context
  getWindowsVersion,    // async: accurately distinguish Windows 10 / 11
  getLanguage,          // extract browser language from NavContext
  getEnvContext,        // collect all browser signals (Client Hints, WebGL, etc.)
  parseHeaders,         // parse UA and Client Hints from HTTP headers (SSR)
  ACCEPT_CH,            // response header constant to request Client Hints
  isWebview,            // detect Android Webview / iOS WKWebView
  detectBot,            // standalone bot detection
  detectBrowser,        // standalone browser detection
  detectOS,             // standalone OS detection
  detectArch,           // standalone CPU architecture detection
  detectHeadless,       // standalone headless browser detection
  satisfies,            // condition-matching helper
  VERSION,              // current library version
} from 'ua-browser'
```

### Return value `EnvOption`

| Field | Type | Description |
| :-- | :-- | :-- |
| `browser` | `BrowserName` | Browser name |
| `version` | `string` | Browser version |
| `versionMajor` | `number` | Browser major version (`parseInt(version)`) |
| `engine` | `EngineName` | Rendering engine |
| `os` | `OsName` | Operating system |
| `osVersion` | `string` | OS version |
| `device` | `DeviceName` | Device type: `Mobile` \| `Tablet` \| `PC` \| `TV` \| `Console` \| `XR` |
| `arch` | `ArchName` | CPU architecture |
| `isWebview` | `boolean` | Whether running in Android Webview or iOS WKWebView |
| `isHeadless` | `boolean` | Whether running in a headless / automated browser |
| `isBot` | `boolean` | Whether the UA belongs to a bot / crawler |
| `botName` | `BotName` | Bot name |
| `language` | `string` | Browser language, e.g. `en-US` |
| `platform` | `string` | Platform identifier, e.g. `Win32` |
| `connectionType` | `string` | Network type: `4g` \| `3g` \| `2g` \| `slow-2g` \| `unknown` |

> All fields return `'unknown'` when undetected — never an empty string or `null`.

## Supported

Over 70 browsers, 20 operating systems, and 40+ bot rules built in. See the **[full support list](https://yangtianxia.github.io/ua-browser/guide/support-list)**.

Highlights:
- **Browsers** — Chrome, Safari, Arc, Brave, Firefox, Edge, Samsung Internet, UC, WeChat, DingTalk, TikTok, Bilibili, Kuaishou, Xiaohongshu, Feishu and more
- **OS** — Windows, macOS, Android, iOS, visionOS, tvOS, HarmonyOS, OpenHarmony, Tizen, KaiOS and more
- **Bots** — GPTBot, ClaudeBot, PerplexityBot, CCBot; messaging bots (Slack, Discord, Telegram, WhatsApp) and more
- **Devices** — Mobile, Tablet, PC, TV (Samsung Smart TV, HbbTV), Console (PS5, Xbox, Switch), XR (Vision Pro, Quest)

## License

[MIT](./LICENSE) © yangtianxia
