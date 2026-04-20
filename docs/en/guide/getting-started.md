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
  parseUA,           // Pure function, ideal for SSR / Node.js
  isWebview,         // Detect Android Webview
  isWechatMiniapp,   // Detect WeChat Mini Program
  getNavContext,     // Read current browser navigator context
  getLanguage,       // Get browser language from NavContext
  getWindowsVersion, // Async: accurately detect Windows 10 / 11
  detectBot,         // Standalone bot detection
  detectArch,        // Standalone CPU architecture detection
  detectHeadless,    // Standalone headless browser detection
  VERSION            // Current library version
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
