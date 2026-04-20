# ua-browser

[![npm version](https://img.shields.io/npm/v/ua-browser?color=cb3837)](https://www.npmjs.com/package/ua-browser)
[![npm downloads](https://img.shields.io/npm/dm/ua-browser)](https://www.npmjs.com/package/ua-browser)
[![license](https://img.shields.io/npm/l/ua-browser)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6)](https://www.typescriptlang.org/)

Detect browser, OS, device type, rendering engine, CPU architecture, bots, and headless browsers from User Agent strings. Zero dependencies. Works in both browser and Node.js environments.

**[📖 Documentation](https://yangtianxia.github.io/ua-browser/)** · **[🎮 Playground](https://yangtianxia.github.io/ua-browser/playground)** · **[中文](./README.zh-CN.md)**

## Features

- **Comprehensive detection** — browser, OS, engine, device type (Mobile / Tablet / TV / PC), CPU arch, bots, headless browsers
- **AI bot recognition** — built-in support for GPTBot, ClaudeBot, PerplexityBot, CCBot and more
- **Zero dependencies** — no runtime dependencies, tiny bundle size after gzip
- **Pure function** — `parseUA()` has no global state, works seamlessly with SSR / Node.js
- **TypeScript** — full type definitions with precise literal union types (`BrowserName`, `OsName`, etc.)
- **Named exports** — import specific functions like `parseUA`, `detectBot`, etc.

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
//   browser:    'Chrome',
//   version:    '124.0.0.0',
//   engine:     'Blink',
//   os:         'Windows',
//   osVersion:  '10',
//   device:     'PC',
//   arch:       'x86_64',
//   isWebview:  false,
//   isHeadless: false,
//   isBot:      false,
//   botName:    'unknown',
//   language:   'en-US',
//   platform:   'Win32'
// }
```

> Pass a custom UA string: `uaBrowser('Mozilla/5.0 ...')`

## Usage

### Browser

```typescript
import uaBrowser from 'ua-browser'

const { browser, os, device } = uaBrowser()

if (device === 'Mobile') {
  // redirect to mobile version
}

if (browser === 'Wechat') {
  // WeChat in-app browser logic
}
```

### Node.js / SSR

Use the pure `parseUA` function with the UA string from the request header:

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

### Default export `uaBrowser(ua?)`

Automatically injects the `navigator` context (language, platform, MIME types, etc.) in browser environments.

```typescript
import uaBrowser from 'ua-browser'

uaBrowser()          // reads navigator.userAgent automatically
uaBrowser(customUA)  // custom UA string, still injects browser context
```

### Named exports

```typescript
import {
  parseUA,           // pure function, ideal for SSR / Node.js
  getNavContext,     // read current browser navigator context
  getWindowsVersion, // async: accurately distinguish Windows 10 / 11
  getLanguage,       // extract browser language from NavContext
  isWebview,         // detect Android Webview (UA contains "; wv")
  isWechatMiniapp,   // detect WeChat Mini Program environment
  detectBot,         // standalone bot detection
  detectArch,        // standalone CPU architecture detection
  detectHeadless,    // standalone headless browser detection
  VERSION,           // current library version
} from 'ua-browser'
```

### Return value `EnvOption`

| Field | Type | Description |
| :-- | :-- | :-- |
| `browser` | `BrowserName` | Browser name |
| `version` | `string` | Browser version |
| `engine` | `EngineName` | Rendering engine |
| `os` | `OsName` | Operating system |
| `osVersion` | `string` | OS version |
| `device` | `DeviceName` | Device type: `Mobile` \| `Tablet` \| `TV` \| `PC` |
| `arch` | `ArchName` | CPU architecture |
| `isWebview` | `boolean` | Whether running in Android Webview |
| `isHeadless` | `boolean` | Whether running in a headless / automated browser |
| `isBot` | `boolean` | Whether the UA belongs to a bot / crawler |
| `botName` | `BotName` | Bot name |
| `language` | `string` | Browser language, e.g. `en-US` |
| `platform` | `string` | Platform identifier, e.g. `Win32` |

> All fields return `'unknown'` when undetected — never an empty string or `null`.

## Supported

Over 60 browsers, 17 operating systems, and 19 bot rules built in. See the **[full support list](https://yangtianxia.github.io/ua-browser/guide/support-list)**.

Highlights:
- **Browsers** — Chrome, Safari, Firefox, Edge, Samsung Internet, UC, WeChat, DingTalk, TikTok and more
- **OS** — Windows, macOS, Android, iOS, HarmonyOS, Tizen, KaiOS and more
- **AI bots** — GPTBot, ClaudeBot, PerplexityBot, CCBot and more
- **Devices** — Mobile, Tablet, TV (Samsung Smart TV, HbbTV), PC

## License

[MIT](./LICENSE) © yangtianxia
