---
title: Standalone Detectors — detectBot() and detectOS()
description: Import only the detector you need — detectBot(), detectBrowser(), detectOS() — to keep browser bundles small or run a single check in Node.js.
---

# Standalone Detectors


---

Standalone detectors skip the full `parseUA()` pipeline. They suit cases where you need just one kind of detection, and they tree-shake well to keep bundles small.


---

## `detectBot(ua, customDefs?)` {#detectbot}

Standalone bot detector; does not run the full `parseUA()` pipeline.

```typescript
import { detectBot } from 'ua-browser'
import type { BotDef } from 'ua-browser'

detectBot(ua: string, customDefs?: readonly BotDef[]): { isBot: boolean; botName: BotName; botCategory: BotCategory }
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | Yes | UA string to inspect |
| `customDefs` | `readonly BotDef[]` | No | Extra bot rules, inserted after the built-in rules and before the `GenericBot` fallback |

**Returns:** `{ isBot: boolean; botName: BotName; botCategory: BotCategory }`

**`BotDef` shape:**

```typescript
interface BotDef {
  name: BotName         // botName value returned on a match
  detect: RegExp        // regex matched against the UA string
  category: BotCategory // bot category
}
```

**Example:**

```typescript
const { isBot, botName, botCategory } = detectBot(ua)
// isBot: true, botName: 'Googlebot', botCategory: 'search-engine'

// Custom rules
const myDefs: BotDef[] = [
  { name: 'GenericBot', detect: /MyInternalCrawler/ }
]
detectBot(ua, myDefs)

// Or pass them through parseUA for the full result
parseUA(ua, { customBotDefs: myDefs })
```

**Notes:**
- Built-in rules cover 30+ bots, including AI training crawlers (GPTBot, ClaudeBot, PerplexityBot, CCBot, and more).
- `customDefs` does not modify any global state.

---

---

## `detectBrowser(ua)` {#detectbrowser}

Standalone browser detector; does not run the full `parseUA()` pipeline.

```typescript
import { detectBrowser } from 'ua-browser'

detectBrowser(ua: string): { browser: BrowserName; version: string; browserType: BrowserType }
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | Yes | UA string |

**Returns:** `{ browser: BrowserName; version: string; browserType: BrowserType }`

**Example:**

```typescript
const { browser, version, browserType } = detectBrowser(navigator.userAgent)
// browser: 'Chrome', version: '124.0.0.0', browserType: 'browser'
```

---

---

## `detectOS(ua)` {#detectos}

Standalone operating system detector; does not run the full `parseUA()` pipeline.

```typescript
import { detectOS } from 'ua-browser'

detectOS(ua: string): { os: OsName; osVersion: string; osVersionName: string }
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | Yes | UA string |

**Returns:** `{ os: OsName; osVersion: string; osVersionName: string }`

**Example:**

```typescript
const { os, osVersion, osVersionName } = detectOS(navigator.userAgent)
// os: 'Windows', osVersion: '10', osVersionName: 'Windows 10'
```

---

---

## `detectEngine(ua)` {#detectengine}

Standalone rendering engine detector; does not run the full `parseUA()` pipeline.

```typescript
import { detectEngine } from 'ua-browser'

detectEngine(ua: string): { engine: EngineName; engineVersion: string }
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | Yes | UA string |

**Returns:** `{ engine: EngineName; engineVersion: string }`

**Example:**

```typescript
const { engine, engineVersion } = detectEngine(navigator.userAgent)
// engine: 'Blink', engineVersion: '537.36'
```

---

---

## `detectDevice(ua)` {#detectdevice}

Standalone device-type detector; does not run the full `parseUA()` pipeline. It infers from the UA string alone — no hardware signals.

```typescript
import { detectDevice } from 'ua-browser'

detectDevice(ua: string): DeviceName
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | Yes | UA string |

**Returns:** [`DeviceName`](/api/types#devicename)

**Example:**

```typescript
const device = detectDevice(navigator.userAgent)
// device: 'Mobile'
```

---

---

## `detectVendorModel(ua)` {#detectvendormodel}

Standalone device vendor / model extractor.

```typescript
import { detectVendorModel } from 'ua-browser'

detectVendorModel(ua: string): VendorModelResult
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | Yes | UA string |

**Returns:** [`VendorModelResult`](/api/types#vendormodelresult)

**Example:**

```typescript
const { vendor, model } = detectVendorModel(ua)
// vendor: 'Samsung', model: 'SM-G991B'
```

---

---

## `detectArch(ua, ctx?)` {#detectarch}

Standalone CPU architecture detector. Without `ctx` it relies on UA-string heuristics alone.

```typescript
import { detectArch } from 'ua-browser'

detectArch(ua: string, ctx?: EnvContext): ArchName
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | Yes | UA string |
| `ctx` | [`EnvContext`](/api/types#envcontext) | No | Return value of `getEnvContext()`; enables GPU and Client Hints detection |

**Returns:** [`ArchName`](/api/types#archname) — `'x86' | 'x86_64' | 'arm' | 'arm64' | 'unknown'`

**Detection priority chain:**

1. Client Hints `Sec-CH-UA-Arch` (most precise)
2. WebGL renderer string (ANGLE → x86/x86_64; Apple GPU → arm64; Adreno/Mali → arm64)
3. `navigator.platform` (e.g. `'Win32'` → x86_64; `'iPhone'` → arm64)
4. UA string patterns (least precise — affected by UA freezing)

**Example:**

```typescript
import { detectArch, getEnvContext } from 'ua-browser'

const ctx = await getEnvContext()
const arch = detectArch(navigator.userAgent, ctx)
// 'arm64' on Apple Silicon, 'x86_64' on Intel Macs
```

---

---

## `detectHeadless(ua)` {#detectheadless}

Detects whether the UA string indicates a headless browser.

```typescript
import { detectHeadless } from 'ua-browser'

detectHeadless(ua: string): boolean
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | Yes | UA string to inspect |

**Returns:** `boolean`

**Markers it catches:** `HeadlessChrome`, `Headless`, `PhantomJS`, `Electron`, `Playwright`, `jsdom`, `Selenium`.

> Modern Puppeteer / Playwright can hide these markers in stealth mode; this function covers only the common, unmasked cases.

**Example:**

```typescript
detectHeadless('Mozilla/5.0 ... HeadlessChrome/124.0.0.0 ...')
// true
```

---

---

## `isWebview(ua)` {#iswebview}

Detects whether the UA string indicates an embedded WebView (Android WebView or iOS WKWebView).

```typescript
import { isWebview } from 'ua-browser'

isWebview(ua: string): boolean
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | Yes | UA string to inspect |

**Returns:** `boolean`

**Detection logic:**
- **Android WebView:** the UA contains the `; wv)` marker
- **iOS WKWebView:** a Safari UA missing both the `Version/` and `Safari/` tokens (WKWebView strips them)

**Example:**

```typescript
isWebview('Mozilla/5.0 (Linux; Android 10; K; wv) ...')   // true  (Android)
isWebview('Mozilla/5.0 (iPhone ...) ... Mobile/15E148')    // true  (iOS WKWebView)
isWebview('Mozilla/5.0 ... Version/17.4 ... Safari/604.1') // false (real Safari)
```

---

---

## `satisfies(info, criteria)` {#satisfies}

A helper for conditional matching. Type-checked by TypeScript, and tidier than a hand-written chain of `&&`.

```typescript
import { satisfies } from 'ua-browser'

satisfies(info: EnvOption, criteria: Partial<EnvOption>): boolean
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `info` | [`EnvOption`](/api/types#envoption) | Yes | Return value from `parseUA()` or `uaBrowser()` |
| `criteria` | `Partial<EnvOption>` | Yes | Subset of fields to match |

**Returns:** `boolean`

**Example:**

```typescript
import uaBrowser, { satisfies } from 'ua-browser'

const info = uaBrowser()

// Same as info.os === 'iOS' && info.device === 'Mobile'
if (satisfies(info, { os: 'iOS', device: 'Mobile' })) {
  // ...
}

// Match AI crawlers only
if (satisfies(info, { isBot: true, botCategory: 'ai-llm' })) {
  // ...
}

// Match app-embedded browsers only (WeChat, DingTalk, …)
if (satisfies(info, { browserType: 'app' })) {
  // ...
}
```

---

---

## `VERSION` {#version}

The current library version string, matching the `version` field in `package.json`.

```typescript
import { VERSION } from 'ua-browser'

VERSION: string  // e.g. '2.0.0'
```
