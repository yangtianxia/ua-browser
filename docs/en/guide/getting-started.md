---
title: Getting Started
description: Install and use ua-browser — zero-dependency UA detection for browsers, Node.js, and SSR frameworks. One call returns browser, OS, device type, and more.
---

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

## Why UA Strings Aren't Enough

UA strings are the traditional way to detect the browser environment, but they break down in several well-known scenarios:

| Scenario | The problem |
| :-- | :-- |
| **Chrome privacy freeze** | Chrome 109+ locks the minor version to `0.0.0` — `Chrome/149.0.0.0` is every Chrome 149.x user's UA |
| **macOS 26+ freeze** | Apple froze the macOS version in Chrome's UA at `Mac OS X 10_15_7` starting from macOS 26 |
| **Phone in desktop mode** | The UA claims desktop, but the device is still a phone — screen size, touch, and safe-area all say mobile |
| **Headless browser spoofing** | Playwright and Puppeteer default UAs are indistinguishable from real Chrome |
| **AI crawlers** | GPTBot, ClaudeBot, and similar bots use their own UA format — string matching misses or misidentifies them |

ua-browser fills these gaps using **hardware signals** (WebGL renderer, CSS safe-area, Vibration API, etc.) and **Client Hints** (`Sec-CH-UA-*` / `getHighEntropyValues`).

## Choosing the Right API

| API | Environment | Capability | Use when |
| :-- | :-- | :-- | :-- |
| `uaBrowser.detect()` | Browser (async) | UA + hardware signals + Client Hints | **Browser-side default** — need accurate version, device, arch |
| `uaBrowser()` | Browser (sync) | UA + basic navigator signals | Quick read, version accuracy not required |
| `parseHeaders(headers)` | Node.js / SSR | UA + Sec-CH-UA-* request headers | Server-side with Client Hints headers available |
| `parseUA(ua)` | Node.js / SSR | UA string only | Server-side with no Client Hints headers |

---

## Browser (recommended: `detect`)

`detect()` collects hardware signals on top of UA parsing and is the recommended browser-side entry point.

```typescript
import uaBrowser from 'ua-browser'

const result = await uaBrowser.detect()

console.log(result.version)   // '149.0.7827.102' — real version, not the frozen UA value
console.log(result.osVersion) // '26.5.1' — real macOS version
console.log(result.device)    // 'Mobile' — correct even in desktop mode
console.log(result.arch)      // 'arm64' — Apple Silicon vs Intel
```

**What `detect()` collects beyond the UA string:**
- **Client Hints** — real browser version (`fullVersionList`), platform version (`platformVersion`), CPU architecture
- **WebGL renderer** — GPU model to distinguish Apple Silicon / Intel / AMD / Qualcomm
- **CSS safe-area-inset** — detects iPhone notch / Dynamic Island, not spoofable by UA
- **Vibration / motion APIs** — distinguishes real mobile devices from desktop browsers faking mobile

> **Note**: `detect()` uses the Client Hints high-entropy API (`getHighEntropyValues`), which is only available in **HTTPS or localhost** contexts. On plain HTTP pages it degrades silently — browser version and OS version fall back to the frozen UA string values (e.g. Chrome reports `149.0.0.0`, macOS 26+ reports `10.15.7`).

---

## Browser (sync: `uaBrowser`)

When you don't need accurate version or device detection, a synchronous call is simpler:

```typescript
import uaBrowser from 'ua-browser'

const { browser, os, device, isBot } = uaBrowser()

if (device === 'Mobile') {
  // Note: a phone in desktop mode is detected as 'PC' here.
  // Use uaBrowser.detect() when accurate device detection matters.
}
```

**Limitations compared to `detect()`:**
- Chrome version is frozen (`149.0.0.0`)
- macOS 26+ version is frozen (`10.15.7`)
- Cannot detect phones in desktop mode
- Cannot distinguish Apple Silicon from Intel (`arch` returns `unknown`)

---

## Node.js / SSR (`parseUA`)

A pure function with no browser API dependencies — runs in Node.js, Deno, and Edge Runtime:

```typescript
import { parseUA } from 'ua-browser'

const ua = req.headers['user-agent'] ?? ''
const { browser, os, isBot } = parseUA(ua)

if (isBot) {
  // block or allow crawlers
}
```

---

## Node.js / SSR + Client Hints (`parseHeaders`)

If your server receives `Sec-CH-UA-*` request headers (Chrome / Edge 90+ sends these over HTTPS), `parseHeaders` gives more accurate results:

```typescript
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

// First response — tell the browser to start sending Client Hints
res.setHeader('Accept-CH', ACCEPT_CH)

// Subsequent requests carry Sec-CH-UA-* headers
const result = parseHeaders(req.headers)
console.log(result.version)   // '149.0.7827.102' — from Sec-CH-UA-Full-Version-List
console.log(result.arch)      // 'x86_64' — from Sec-CH-UA-Arch
console.log(result.osVersion) // '26.5.1' — from Sec-CH-UA-Platform-Version
```

Advantages over `parseUA`:
- Real browser full version (not the frozen UA value)
- Real OS version (macOS 26+, Windows 10/11 distinction)
- Detects Brave browser (`Sec-CH-UA` carries the `"Brave"` brand)

---

## Named Exports (Tree-shakeable)

Import only what you need — unused code is eliminated by tree-shaking:

```typescript
import {
  parseUA,           // pure function, ideal for SSR / Node.js
  parseHeaders,      // parse UA and Client Hints from HTTP headers
  ACCEPT_CH,         // response header constant to request Client Hints
  getEnvContext,     // collect all browser signals (Client Hints, WebGL, etc.)
  getNavContext,     // read current browser navigator context
  getWindowsVersion, // async: accurately distinguish Windows 10 / 11
  getLanguage,       // extract browser language from NavContext
  isWebview,         // detect Android Webview / iOS WKWebView
  detectBot,         // standalone bot detection
  detectBrowser,     // standalone browser detection
  detectOS,          // standalone OS detection
  detectEngine,      // standalone rendering engine detection
  detectDevice,      // standalone device type detection
  detectArch,        // standalone CPU architecture detection
  detectHeadless,    // standalone headless browser detection
  satisfies,         // condition-matching helper
  VERSION            // current library version
} from 'ua-browser'
```

---

## CDN

```html
<script src="https://cdn.jsdelivr.net/npm/ua-browser/dist/index.min.js"></script>
<script>
  const info = uaBrowser()
  console.log(info.browser) // 'Chrome'
</script>
```
