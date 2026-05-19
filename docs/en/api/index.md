# API Reference

## Default Export

### `uaBrowser(ua?)`

Synchronously parse a UA string and return a full environment info object. In browser environments, automatically reads `navigator.userAgent` and injects the `navigator` context (language, platform, touch points).

```typescript
import uaBrowser from 'ua-browser'

uaBrowser(ua?: string, options?: { strategy?: DetectStrategy }): EnvOption
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | No | UA string to parse. Omit to read `navigator.userAgent` automatically. |
| `options.strategy` | [`DetectStrategy`](/en/api/types#detectstrategy) | No | Signal arbitration strategy. Default `'auto'`. |

**Returns:** [`EnvOption`](/en/api/types#envoption)

**Example:**

```typescript
// Auto-reads navigator.userAgent in a browser
const info = uaBrowser()
console.log(info.browser)    // 'Chrome'
console.log(info.os)         // 'Windows'
console.log(info.confidence) // 'low' — UA string only

// Pass a specific UA string
const info2 = uaBrowser('Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 ...')
console.log(info2.device) // 'Mobile'
```

**Notes:**
- Returns `'unknown'` for fields that cannot be determined, never an empty string.
- `confidence` is always `'low'` because this function does not collect hardware signals.
- In Node.js, `navigator` is unavailable; `language` and `platform` will be `'unknown'`.
- For higher accuracy in browsers, use [`uaBrowser.detect()`](#uabrowser-detect).

The default export also exposes the following static members:

```typescript
uaBrowser.detect(ua?: string, options?: { strategy?: DetectStrategy }): Promise<EnvOption>
uaBrowser.isWebview(ua: string): boolean
uaBrowser.getLanguage(): string
uaBrowser.VERSION: string
```

---

### `uaBrowser.detect(ua?)`

Async, high-accuracy version of `uaBrowser()`. Internally calls [`getEnvContext()`](#getenvcontext) to collect hardware and browser signals before parsing, so the returned `confidence` is typically `'medium'` or `'high'`.

**This is the recommended entry point for browser-side code.**

```typescript
uaBrowser.detect(ua?: string, options?: { strategy?: DetectStrategy }): Promise<EnvOption>
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | No | UA string. Omit to read `navigator.userAgent`. |
| `options.strategy` | [`DetectStrategy`](/en/api/types#detectstrategy) | No | Signal arbitration strategy. Default `'auto'`. |

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
console.log(result.device)     // 'Mobile' — correct even in desktop mode
console.log(result.arch)       // 'arm64' or 'x86_64'
console.log(result.confidence) // 'medium' (or 'high' if Client Hints available)
```

**Notes:**
- Browser-only. In Node.js `getEnvContext()` returns empty context, so the result is equivalent to `uaBrowser()`.
- All DOM accesses are wrapped in `try/catch` and will not throw.

---

## Named Exports

### `parseUA(ua, options?)`

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
| `strategy` | [`DetectStrategy`](/en/api/types#detectstrategy) | Signal arbitration strategy. Controls how conflicting signals are resolved. Default `'auto'`. |

**Returns:** [`EnvOption`](/en/api/types#envoption)

**Examples:**

```typescript
// Minimal: UA string only (confidence: 'low')
const result = parseUA(navigator.userAgent)

// With navigator context (confidence: 'low', but language/platform populated)
import { parseUA, getNavContext } from 'ua-browser'
const nav = getNavContext()
const result = parseUA(navigator.userAgent, { nav })
console.log(result.language) // 'en-US'
console.log(result.platform) // 'Win32'

// With full env context (confidence: 'medium')
import { parseUA, getEnvContext } from 'ua-browser'
const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx })
console.log(result.arch)     // 'arm64' (from WebGL / Client Hints)

// With custom bot rules
import { parseUA } from 'ua-browser'
import type { BotDef } from 'ua-browser'
const myBots: BotDef[] = [{ name: 'GenericBot', detect: /MyInternalCrawler/ }]
const result = parseUA(ua, { customBotDefs: myBots })

// hardware-first: Client Hints / hardware wins over spoofed UA
import { parseUA, getEnvContext } from 'ua-browser'
const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx, strategy: 'hardware-first' })
// e.g. in DevTools Android emulation on a Mac:
// result.os     → 'MacOS'  (from Client Hints, not spoofed UA)
// result.device → 'PC'     (from ANGLE renderer, not UA)
// result.confidence → 'high'

// strict: 'unknown' for every field where signals disagree
const result = parseUA(navigator.userAgent, { ctx, strategy: 'strict' })
// result.os         → 'unknown'   (UA says Android, platform says MacOS)
// result.confidence → 'conflict'
```

---

### `parseHeaders(headers)`

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
| `sec-ch-ua-full-version-list` | Exact browser version → `confidence: 'high'` |
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
console.log(result.arch)    // 'x86_64' (from Sec-CH-UA-Arch)
console.log(result.os)      // 'Windows'
console.log(result.confidence) // 'high' when Sec-CH-UA-Full-Version-List present
```

**Notes:**
- Works with Express, Koa, Next.js API routes, Fastify, Hono, etc. — any framework that exposes headers as a plain object.
- If Client Hints headers are absent, falls back to UA-only parsing (`confidence: 'low'`).

---

### `getEnvContext()`

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

console.log(result.device)     // 'Mobile' — correct even in desktop mode
console.log(result.arch)       // 'arm64' (Apple Silicon) or 'x86_64' (Intel)
console.log(result.language)   // 'en-US'
console.log(result.confidence) // 'medium' (or 'high' if Client Hints available)
```

**Notes:**
- Browser-only. Safe to call in Node.js — all DOM accesses are guarded and return `undefined`; the result is equivalent to `getNavContext()`.
- Each DOM API is wrapped in an individual `try/catch`, so a single permission denial does not block the rest.
- Prefer `uaBrowser.detect()` if you don't need to reuse the `ctx` object.

---

### `getWindowsVersion(nav)`

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

### `detectBot(ua, customDefs?)`

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

### `detectArch(ua, ctx?)`

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

### `detectHeadless(ua)`

Detect whether the UA string indicates a headless browser.

```typescript
import { detectHeadless } from 'ua-browser'

detectHeadless(ua: string): boolean
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | Yes | UA string to test. |

**Returns:** `boolean`

**Detected markers:** `HeadlessChrome`, `Headless`, `PhantomJS`, `SlimerJS`, `Nightmare`, `Puppeteer`, `Playwright`, `jsdom`, and other common headless identifiers.

**Example:**

```typescript
detectHeadless('Mozilla/5.0 ... HeadlessChrome/124.0.0.0 ...')
// true
```

---

### `isWebview(ua)`

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

### `getNavContext()`

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

### `getLanguage(nav)`

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

### `ACCEPT_CH`

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

### `VERSION`

The current library version string, matching `version` in `package.json`.

```typescript
import { VERSION } from 'ua-browser'

VERSION: string  // e.g. '1.5.0'
```
