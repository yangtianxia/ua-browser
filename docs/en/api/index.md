# API Reference

## `uaBrowser()` {#uabrowser}

Detect the current browser environment and return a full environment info object. Automatically reads `navigator.userAgent` and injects the `navigator` context (language, platform, touch points).

```typescript
import uaBrowser from 'ua-browser'

uaBrowser(): EnvOption
```

**Returns:** [`EnvOption`](/en/api/types#envoption)

**Example:**

```typescript
const info = uaBrowser()
console.log(info.browser) // 'Chrome'
console.log(info.os)      // 'Windows'
```

**Notes:**
- Returns `'unknown'` for fields that cannot be determined, never an empty string.
- In Node.js, `navigator` is unavailable; `language` and `platform` will be `'unknown'`.
- To parse an arbitrary UA string, use [`parseUA()`](#parseua).
- For higher accuracy in browsers, use [`uaBrowser.detect()`](#uabrowser-detect).

The default export also exposes the following static members:

```typescript
uaBrowser.detect(): Promise<EnvOption>
uaBrowser.isWebview(ua: string): boolean
uaBrowser.getLanguage(): string
uaBrowser.VERSION: string
```

---

## `uaBrowser.detect()` {#uabrowser-detect}

Async, high-accuracy version of `uaBrowser()`. Internally calls [`getEnvContext()`](#getenvcontext) to collect hardware and browser signals before parsing, enabling more accurate device type and CPU architecture detection.

**This is the recommended entry point for browser-side code.**

```typescript
uaBrowser.detect(): Promise<EnvOption>
```

**Returns:** `Promise<`[`EnvOption`](/en/api/types#envoption)`>`

**Signals collected by `detect()`:**

| Signal | Purpose |
| :-- | :-- |
| Client Hints (`Sec-CH-UA-*`) | Exact version, platform, architecture |
| WebGL renderer / vendor | GPU type → mobile vs. desktop, Apple Silicon vs. Intel |
| CSS `env(safe-area-inset-top)` | iOS notch / Dynamic Island → confirms mobile device |
| `devicePixelRatio` | Phone (≥3) vs. Mac (2) vs. monitor (1–2) |
| Vibration / DeviceMotion APIs | Mobile-only APIs → confirms mobile intent |
| Network type (`connection.effectiveType`) | Supplements device classification |
| Font probes | OS-level font availability |

**Example:**

```typescript
import uaBrowser from 'ua-browser'

const result = await uaBrowser.detect()
console.log(result.device) // 'Mobile' — correct even in desktop mode
console.log(result.arch)   // 'arm64' or 'x86_64'
```

**Notes:**
- Browser-only. In Node.js `getEnvContext()` returns empty context, so the result is equivalent to `uaBrowser()`.
- All DOM accesses are wrapped in `try/catch` and will not throw.

---

## `parseUA(ua, options?)` {#parseua}

Pure function: no global state, no DOM access. Suitable for SSR, Node.js, and unit testing.

```typescript
import { parseUA } from 'ua-browser'

parseUA(ua: string, options?: ParseOptions): EnvOption
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | Yes | UA string to parse. |
| `options` | [`ParseOptions`](/en/api/types#parseoptions) | No | Inject context; see below. |

**`ParseOptions` fields:**

| Field | Type | Description |
| :-- | :-- | :-- |
| `nav` | [`NavContext`](/en/api/types#navcontext) | Browser environment subset (language, platform, touch points). Use `getNavContext()` to read from `navigator`. |
| `windowsVersion` | `string \| null` | Pre-resolved Windows version string from `getWindowsVersion()`. Needed to distinguish Windows 10 vs. 11. |
| `ctx` | [`EnvContext`](/en/api/types#envcontext) | Full multi-signal context from `getEnvContext()`. **Takes priority over `nav` and `windowsVersion`** when both are provided. |
| `customBotDefs` | `readonly BotDef[]` | Custom bot detection rules inserted before the `GenericBot` catch-all. Does not affect global state. |
| `language` | `string` | Explicit language override (BCP47). Highest priority — overrides all navigator/header sources. Useful for server-side rendering when passing `Accept-Language`. |

**Returns:** [`EnvOption`](/en/api/types#envoption)

**Examples:**

```typescript
// Minimal: UA string only
const result = parseUA(navigator.userAgent)

// With navigator context (language/platform populated)
import { parseUA, getNavContext } from 'ua-browser'
const nav = getNavContext()
const result = parseUA(navigator.userAgent, { nav })
console.log(result.language) // 'en-US'
console.log(result.platform) // 'Win32'

// With full env context (multi-signal detection enabled)
import { parseUA, getEnvContext } from 'ua-browser'
const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx })
console.log(result.arch) // 'arm64' (from WebGL / Client Hints)

// With custom bot rules
import { parseUA } from 'ua-browser'
import type { BotDef } from 'ua-browser'
const myBots: BotDef[] = [{ name: 'GenericBot', detect: /MyInternalCrawler/ }]
const result = parseUA(ua, { customBotDefs: myBots })
```

---

## `parseHeaders(headers)` {#parseheaders}

Parse UA and Client Hints from HTTP request headers. Returns [`EnvOption`](/en/api/types#envoption). Suitable for precise SSR detection.

```typescript
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

parseHeaders(headers: Record<string, string | string[] | undefined>): EnvOption
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `headers` | `Record<string, string \| string[] \| undefined>` | Yes | HTTP request headers object (e.g. `req.headers` in Express / Next.js). |

**Returns:** [`EnvOption`](/en/api/types#envoption)

**Client Hints headers read:**

| Header | Data |
| :-- | :-- |
| `user-agent` | Full UA string |
| `sec-ch-ua` | Browser brand list |
| `sec-ch-ua-full-version-list` | Exact browser version |
| `sec-ch-ua-platform` | OS name |
| `sec-ch-ua-platform-version` | OS version (distinguishes Windows 10 / 11) |
| `sec-ch-ua-arch` | CPU architecture (e.g. `x86`, `arm`) |
| `sec-ch-ua-mobile` | Mobile hint |

**Two-request pattern:**

On the first request, browsers only send the `user-agent` header. Return `ACCEPT_CH` in the response to request Client Hints; they arrive on subsequent requests.

```typescript
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

// First response — tell the browser to send Client Hints
res.setHeader('Accept-CH', ACCEPT_CH)

// Subsequent requests — full Client Hints included
const result = parseHeaders(req.headers)
console.log(result.arch) // 'x86_64' (from Sec-CH-UA-Arch)
console.log(result.os)   // 'Windows'
```

**Notes:**
- Works with Express, Koa, Next.js API routes, Fastify, Hono, etc. — any framework that exposes headers as a plain object.
- If Client Hints headers are absent, falls back to UA-only parsing.

---

## `getEnvContext()` {#getenvcontext}

Collect all available browser signals in one async call and return an [`EnvContext`](/en/api/types#envcontext) object. Pass the result to `parseUA({ ctx })` for multi-signal detection.

```typescript
import { getEnvContext } from 'ua-browser'

getEnvContext(): Promise<EnvContext>
```

**Returns:** `Promise<`[`EnvContext`](/en/api/types#envcontext)`>`

**Signals collected:**

| Category | Signals |
| :-- | :-- |
| Client Hints | `platform`, `platformVersion`, `architecture`, `fullVersionList` |
| WebGL | GPU renderer + vendor, max texture size, compressed texture formats (ASTC/ETC2/PVRTC/S3TC) |
| Screen | `devicePixelRatio`, `screenWidth`, `screenHeight` |
| CSS env | `safe-area-inset-top` (iOS notch / Dynamic Island) |
| Hardware APIs | `hardwareConcurrency`, `deviceMemory`, vibration API, DeviceMotion event |
| Input | `pointerType` (`coarse`/`fine`/`none`), hover capability |
| Network | `connection.effectiveType`, `connection.saveData` |
| Audio | Sample rate |
| Fonts | OS-specific font availability probes |

**Example:**

```typescript
import { getEnvContext, parseUA } from 'ua-browser'

const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx })

console.log(result.device)   // 'Mobile' — correct even in desktop mode
console.log(result.arch)     // 'arm64' (Apple Silicon) or 'x86_64' (Intel)
console.log(result.language) // 'en-US'
```

**Notes:**
- Browser-only. Safe to call in Node.js — all DOM accesses are guarded and return `undefined`; the result is equivalent to `getNavContext()`.
- Each DOM API is wrapped in an individual `try/catch`, so a single permission denial does not block the rest.
- Prefer `uaBrowser.detect()` if you don't need to reuse the `ctx` object.

---

## `getWindowsVersion(nav)` {#getwindowsversion}

Asynchronously resolve the accurate Windows version to distinguish Windows 10 from Windows 11 (which share the same UA string: `Windows NT 10.0`).

```typescript
import { getWindowsVersion, getNavContext, parseUA } from 'ua-browser'

getWindowsVersion(nav: NavContext): Promise<string | null>
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `nav` | [`NavContext`](/en/api/types#navcontext) | Yes | Browser context; pass `getNavContext()`. |

**Returns:** `Promise<string | null>` — the version string (e.g. `'11'`, `'10'`) or `null` when unavailable.

**Example:**

```typescript
const nav = getNavContext()
const windowsVersion = await getWindowsVersion(nav)
const result = parseUA(navigator.userAgent, { nav, windowsVersion })

console.log(result.osVersion) // '11' or '10'
```

**Notes:**
- Requires `navigator.userAgentData.getHighEntropyValues()` (Chrome 90+, Edge 90+).
- Returns `null` in Firefox, Safari, and Node.js — `osVersion` falls back to UA-derived value.
- `getEnvContext()` already calls this internally; use `getWindowsVersion()` directly only when you want `NavContext`-level context without the full `EnvContext` overhead.

---

## `detectBot(ua, customDefs?)` {#detectbot}

Standalone bot detector. Returns the bot detection result without running the full `parseUA()` pipeline.

```typescript
import { detectBot } from 'ua-browser'
import type { BotDef } from 'ua-browser'

detectBot(ua: string, customDefs?: readonly BotDef[]): { isBot: boolean; botName: BotName }
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | Yes | UA string to test. |
| `customDefs` | `readonly BotDef[]` | No | Additional bot rules. Inserted after built-in rules, before `GenericBot` catch-all. |

**Returns:** `{ isBot: boolean; botName: BotName }`

**`BotDef` shape:**

```typescript
interface BotDef {
  name: BotName   // the bot label returned in botName
  detect: RegExp  // matched against the UA string
}
```

**Example:**

```typescript
const { isBot, botName } = detectBot(ua)
// isBot: true, botName: 'Googlebot'

// Custom rules
const myDefs: BotDef[] = [
  { name: 'GenericBot', detect: /MyInternalCrawler/ }
]
detectBot(ua, myDefs)

// Or pass through parseUA for a full result
parseUA(ua, { customBotDefs: myDefs })
```

**Notes:**
- Built-in rules cover 30+ bots including AI training crawlers (GPTBot, ClaudeBot, PerplexityBot, CCBot, etc.).
- `customDefs` do not modify any global state.

---

## `detectArch(ua, ctx?)` {#detectarch}

Standalone CPU architecture detector. Without `ctx`, falls back to UA-string heuristics only.

```typescript
import { detectArch } from 'ua-browser'

detectArch(ua: string, ctx?: EnvContext): ArchName
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | Yes | UA string. |
| `ctx` | [`EnvContext`](/en/api/types#envcontext) | No | Multi-signal context from `getEnvContext()`. Enables GPU and Client Hints detection. |

**Returns:** [`ArchName`](/en/api/types#archname) — `'x86' | 'x86_64' | 'arm' | 'arm64' | 'unknown'`

**Detection priority chain:**

1. Client Hints `Sec-CH-UA-Arch` (highest accuracy)
2. WebGL renderer string (ANGLE → x86/x86_64; Apple GPU → arm64; Adreno/Mali → arm64)
3. `navigator.platform` (e.g. `'Win32'` → x86_64; `'iPhone'` → arm64)
4. UA string patterns (lowest accuracy — affected by UA freezing)

**Example:**

```typescript
import { detectArch, getEnvContext } from 'ua-browser'

const ctx = await getEnvContext()
const arch = detectArch(navigator.userAgent, ctx)
// 'arm64' on Apple Silicon, 'x86_64' on Intel Mac
```

---

## `detectHeadless(ua)` {#detectheadless}

Detect whether the UA string indicates a headless browser.

```typescript
import { detectHeadless } from 'ua-browser'

detectHeadless(ua: string): boolean
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | Yes | UA string to test. |

**Returns:** `boolean`

**Detected markers:** `HeadlessChrome`, `Headless`, `PhantomJS`, `Electron`, `Playwright`, `jsdom`, `Selenium` and other common headless identifiers.

> **Note:** Tools that spoof a real UA (e.g. Puppeteer with a custom UA) cannot be detected by string matching alone.

**Example:**

```typescript
detectHeadless('Mozilla/5.0 ... HeadlessChrome/124.0.0.0 ...')
// true
```

---

## `isWebview(ua)` {#iswebview}

Detect whether the UA indicates an embedded WebView (Android Webview or iOS WKWebView).

```typescript
import { isWebview } from 'ua-browser'

isWebview(ua: string): boolean
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | Yes | UA string to test. |

**Returns:** `boolean`

**Detection logic:**
- **Android Webview:** UA contains `; wv)` marker
- **iOS WKWebView:** Safari UA that lacks both `Version/` token and `Safari/` token (WKWebView strips them)

**Example:**

```typescript
isWebview('Mozilla/5.0 (Linux; Android 10; K; wv) ...') // true  (Android)
isWebview('Mozilla/5.0 (iPhone ...) ... Mobile/15E148')  // true  (iOS WKWebView)
isWebview('Mozilla/5.0 ... Version/17.4 ... Safari/604.1') // false (real Safari)
```

---

## `getNavContext()` {#getnavcontext}

Read the current browser's `navigator` and return a [`NavContext`](/en/api/types#navcontext) object. In Node.js, returns a safe empty object so callers do not need environment checks.

```typescript
import { getNavContext } from 'ua-browser'

getNavContext(): NavContext
```

**Returns:** [`NavContext`](/en/api/types#navcontext)

**Example:**

```typescript
const nav = getNavContext()
const result = parseUA(navigator.userAgent, { nav })

console.log(result.language) // 'en-US'
console.log(result.platform) // 'Win32'
```

**Notes:**
- Prefer `getEnvContext()` when you also need arch / device accuracy signals.
- `getNavContext()` is synchronous; `getEnvContext()` is async.

---

## `getLanguage(nav)` {#getlanguage}

Extract the normalized browser language from a [`NavContext`](/en/api/types#navcontext). Normalizes the tag to standard BCP 47 form (e.g. `'en-us'` → `'en-US'`, `'ZH_CN'` → `'zh-CN'`).

```typescript
import { getLanguage, getNavContext } from 'ua-browser'

getLanguage(nav: NavContext): string
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `nav` | [`NavContext`](/en/api/types#navcontext) | Yes | Browser context. |

**Returns:** `string` — normalized language tag, e.g. `'en-US'`, `'zh-CN'`, or `'unknown'`.

**Example:**

```typescript
const nav = getNavContext()
console.log(getLanguage(nav)) // 'en-US'
```

---

## `ACCEPT_CH` {#accept-ch}

Constant string containing all Client Hints headers that `parseHeaders()` can consume. Set it as the `Accept-CH` response header to request these hints from supporting browsers (Chrome / Edge 90+).

```typescript
import { ACCEPT_CH } from 'ua-browser'

ACCEPT_CH: string
// 'Sec-CH-UA, Sec-CH-UA-Full-Version-List, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch, Sec-CH-UA-Mobile'
```

**Example:**

```typescript
res.setHeader('Accept-CH', ACCEPT_CH)
res.setHeader('Vary', 'Sec-CH-UA, Sec-CH-UA-Full-Version-List')  // optional but recommended
```

---

## `detectBrowser(ua)` {#detectbrowser}

Standalone browser detector that does not run the full `parseUA()` pipeline.

```typescript
import { detectBrowser } from 'ua-browser'

detectBrowser(ua: string): { browser: BrowserName; version: string }
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | Yes | UA string |

**Returns:** `{ browser: BrowserName; version: string }`

**Example:**

```typescript
const { browser, version } = detectBrowser(navigator.userAgent)
// browser: 'Chrome', version: '124.0.0.0'
```

---

## `detectOS(ua)` {#detectos}

Standalone OS detector that does not run the full `parseUA()` pipeline.

```typescript
import { detectOS } from 'ua-browser'

detectOS(ua: string): { os: OsName; osVersion: string }
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | Yes | UA string |

**Returns:** `{ os: OsName; osVersion: string }`

**Example:**

```typescript
const { os, osVersion } = detectOS(navigator.userAgent)
// os: 'Windows', osVersion: '10'
```

---

## `satisfies(info, criteria)` {#satisfies}

Condition-matching helper. TypeScript-aware, cleaner than chaining `&&` expressions.

```typescript
import { satisfies } from 'ua-browser'

satisfies(info: EnvOption, criteria: Partial<EnvOption>): boolean
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `info` | [`EnvOption`](/en/api/types#envoption) | Yes | Return value from `parseUA()` or `uaBrowser()` |
| `criteria` | `Partial<EnvOption>` | Yes | Subset of fields to match against |

**Returns:** `boolean`

**Example:**

```typescript
import uaBrowser, { satisfies } from 'ua-browser'

const info = uaBrowser()

// equivalent to: info.os === 'iOS' && info.device === 'Mobile'
if (satisfies(info, { os: 'iOS', device: 'Mobile' })) {
  // ...
}
```

---

## `VERSION` {#version}

The current library version string, matching `version` in `package.json`.

```typescript
import { VERSION } from 'ua-browser'

VERSION: string  // e.g. '2.0.0'
```
