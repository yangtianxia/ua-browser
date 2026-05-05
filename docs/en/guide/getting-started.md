# Getting Started

## Installation

::: code-group

```sh [npm]
npm i ua-browser
```

```sh [pnpm]
pnpm add ua-browser
```

```sh [yarn]
yarn add ua-browser
```

:::

## Basic Usage

```typescript
import uaBrowser from 'ua-browser'

// Automatically reads the current browser's UA
const info = uaBrowser()

// Or pass a custom UA string
const info = uaBrowser('Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...')

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

## Named Exports (Tree-shakeable)

Import specific functions — Vite / Rollup / webpack 5+ will eliminate unused code automatically:

```typescript
import {
  parseUA,              // Pure function, ideal for SSR / Node.js
  getNavContext,        // Read current browser navigator context
  getWindowsVersion,    // Async: accurately distinguish Windows 10 / 11
  getLanguage,          // Extract browser language from NavContext
  getEnvContext,        // Collect all browser signals (Client Hints, WebGL, etc.)
  parseHeaders,         // Parse UA and Client Hints from HTTP headers (SSR)
  ACCEPT_CH,            // Response header constant to request Client Hints from browsers
  isWebview,            // Detect Android Webview / iOS WKWebView
  isWechatMiniapp,      // Detect WeChat Mini Program environment
  isAlipayMiniapp,      // Detect Alipay Mini Program environment
  isBaiduMiniapp,       // Detect Baidu Smart Mini Program environment
  isDouyinMiniapp,      // Detect Douyin Mini Program environment
  isQQMiniapp,          // Detect QQ Mini Program environment
  isKuaishouMiniapp,    // Detect Kuaishou Mini Program environment
  detectBot,            // Standalone bot detection
  detectArch,           // Standalone CPU architecture detection
  detectHeadless,       // Standalone headless browser detection
  VERSION               // Current library version
} from 'ua-browser'
```

## Node.js / SSR

Use the pure `parseUA` function and pass the UA string from the request header:

```typescript
import { parseUA } from 'ua-browser'

// Parse UA from request header
const ua = req.headers['user-agent'] ?? ''
const result = parseUA(ua)

console.log(result.browser) // 'Chrome'
console.log(result.os)      // 'Windows'
```

### Accurate Windows 10 / 11 Detection

Windows 10 and 11 share the same UA string. Use `navigator.userAgentData` to distinguish them. **Browser-only** — returns `null` in Node.js:

```typescript
import { parseUA, getWindowsVersion, getNavContext } from 'ua-browser'

const nav = getNavContext()
const windowsVersion = await getWindowsVersion(nav)
const result = parseUA(navigator.userAgent, { nav, windowsVersion })

console.log(result.osVersion) // '11' or '10'
```

## High-Accuracy Architecture Detection (getEnvContext)

`getEnvContext()` collects Client Hints, WebGL renderer, font probes, and other signals in one async call, enabling precise arch detection (e.g. Apple Silicon vs. Intel Mac):

```typescript
import { getEnvContext, parseUA } from 'ua-browser'

const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx })

console.log(result.arch)     // 'arm64' (Apple Silicon) or 'x86_64'
console.log(result.language) // 'en-US'
```

## SSR Client Hints (parseHeaders)

Set the `ACCEPT_CH` response header to tell supporting browsers (Chrome / Edge 90+) to send Client Hints; then use `parseHeaders` to accurately parse them on subsequent requests:

```typescript
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

// On the first response, set the Accept-CH header
res.setHeader('Accept-CH', ACCEPT_CH)

// On subsequent requests that include Client Hints
const result = parseHeaders(req.headers)
console.log(result.arch)    // 'x86_64' (from Sec-CH-UA-Arch)
console.log(result.os)      // 'Windows'
```

## Browser (CDN)

```html
<script src="https://cdn.jsdelivr.net/npm/ua-browser/dist/index.min.js"></script>
<script>
  const info = uaBrowser()
  console.log(info.browser) // 'Chrome'
</script>
```

## Standalone Detectors

```typescript
import { detectBot, detectArch, detectHeadless } from 'ua-browser'

const ua = navigator.userAgent

// Bot detection
const { isBot, botName } = detectBot(ua)
// isBot: true, botName: 'Googlebot'

// CPU architecture detection
const arch = detectArch(ua)
// 'x86_64' | 'arm64' | 'arm' | 'x86' | 'unknown'

// Headless browser detection
const isHeadless = detectHeadless(ua)
// true | false
```
