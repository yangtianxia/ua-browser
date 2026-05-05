# API Reference

## Default Export

### `uaBrowser(ua?)`

Parse a UA string and return a full environment info object. Automatically injects `navigator` context in browser environments.

```typescript
import uaBrowser from 'ua-browser'

uaBrowser(ua?: string): EnvOption
```

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `ua` | `string` | Optional. UA string. Omit to read `navigator.userAgent` automatically. |

**Returns:** [`EnvOption`](/en/api/types#envoption)

The default export also exposes the following static methods:

```typescript
uaBrowser.isWebview(ua: string): boolean
uaBrowser.isWechatMiniapp(): boolean
uaBrowser.isAlipayMiniapp(): boolean
uaBrowser.isBaiduMiniapp(): boolean
uaBrowser.isDouyinMiniapp(): boolean
uaBrowser.isQQMiniapp(): boolean
uaBrowser.isKuaishouMiniapp(): boolean
uaBrowser.getLanguage(): string
uaBrowser.VERSION: string
```

---

## Named Exports

### `parseUA(ua, options?)`

Pure function version, suitable for SSR / Node.js environments, with no global side effects.

```typescript
import { parseUA } from 'ua-browser'

parseUA(ua: string, options?: ParseOptions): EnvOption
```

```typescript
interface ParseOptions {
  nav?: NavContext              // inject browser environment context (language, platform, etc.)
  windowsVersion?: string | null  // pre-resolved Windows version
  ctx?: EnvContext              // multi-signal context from getEnvContext(); takes priority over nav and windowsVersion
}
```

---

### `isWebview(ua)`

Detect whether the UA contains `; wv` (Android Webview marker) or iOS WKWebView characteristics (no `Version/` and no `Safari/`).

```typescript
isWebview(ua: string): boolean
```

---

### `isWechatMiniapp()`

Detect whether the current environment is a WeChat Mini Program (relies on the `__wxjs_environment` global variable).

```typescript
isWechatMiniapp(): boolean
```

---

### Mini Program Detection Functions

Each platform's Mini Program is detected via runtime global variables, returning `true` only in the corresponding Mini Program environment.

| Function | Platform | Detection |
| :-- | :-- | :-- |
| `isAlipayMiniapp()` | Alipay | `window.my.getSystemInfo` |
| `isBaiduMiniapp()` | Baidu | `swan.getSystemInfo` |
| `isDouyinMiniapp()` | Douyin | `tt.getSystemInfo` |
| `isQQMiniapp()` | QQ | `qq.getSystemInfo` |
| `isKuaishouMiniapp()` | Kuaishou | `ks.getSystemInfo` |

```typescript
import {
  isAlipayMiniapp,
  isBaiduMiniapp,
  isDouyinMiniapp,
  isQQMiniapp,
  isKuaishouMiniapp,
} from 'ua-browser'
```

When the corresponding Mini Program global API is present, `parseUA()` automatically updates the `browser` field to the corresponding Miniapp value (e.g. `'Alipay Miniapp'`).

---

### `getEnvContext()`

Collect all browser environment signals in one call (Client Hints, WebGL renderer, font probes, media features, etc.) and return an `EnvContext` object.

```typescript
import { getEnvContext } from 'ua-browser'

getEnvContext(): Promise<EnvContext>
```

The collected signals improve architecture detection accuracy (e.g. distinguishing Apple Silicon from Intel Mac) and provide a richer runtime context.

```typescript
const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx })

console.log(result.arch)     // 'arm64' (from WebGL / Client Hints)
console.log(result.language) // 'en-US'
console.log(result.platform) // 'MacIntel'
```

> All DOM APIs inside `getEnvContext()` are wrapped in `try/catch` and will not throw.

---

### `parseHeaders(headers)`

Parse UA and Client Hints from HTTP request headers and return an `EnvOption`. Suitable for precise SSR detection.

```typescript
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

parseHeaders(headers: Record<string, string | string[] | undefined>): EnvOption
```

Return `ACCEPT_CH` in the response header to tell supporting browsers (Chrome / Edge 90+) to send Client Hints in subsequent requests:

```typescript
// Express / Koa / Next.js API Route
res.setHeader('Accept-CH', ACCEPT_CH)

// Once Client Hints are included, parseHeaders can accurately detect architecture and more
const result = parseHeaders(req.headers)
console.log(result.arch) // 'x86_64' (from Sec-CH-UA-Arch)
```

---

### `getWindowsVersion(nav)`

Asynchronously get the accurate Windows version (to distinguish Windows 10 / 11).

```typescript
getWindowsVersion(nav: NavContext): Promise<string | null>
```

`await` this before calling `parseUA`, then pass the result as the `windowsVersion` option.

> Requires `navigator.userAgentData` (Client Hints API). Browser-only — returns `null` in Node.js or when the API is unavailable (Chrome 90+).

---

### `detectBot(ua)`

Standalone bot detector.

```typescript
detectBot(ua: string): { isBot: boolean; botName: BotName }
```

---

### `detectArch(ua, ctx?)`

Standalone CPU architecture detector. Pass an `EnvContext` to enable multi-signal detection.

```typescript
detectArch(ua: string, ctx?: EnvContext): ArchName
```

---

### `detectHeadless(ua)`

Standalone headless browser detector.

```typescript
detectHeadless(ua: string): boolean
```

---

### `getNavContext()`

Read the current browser's `navigator` and return a [`NavContext`](/en/api/types#navcontext) object. Returns a safe empty object in Node.js.

```typescript
import { getNavContext } from 'ua-browser'

getNavContext(): NavContext
```

Typically used with `parseUA` to inject browser context into the pure function:

```typescript
const nav = getNavContext()
const result = parseUA(navigator.userAgent, { nav })

console.log(result.language) // 'en-US'
console.log(result.platform) // 'Win32'
```

---

### `getLanguage(nav)`

Extract the normalized browser language from a [`NavContext`](/en/api/types#navcontext), e.g. `'en-US'`, `'zh-CN'`.

```typescript
import { getLanguage, getNavContext } from 'ua-browser'

getLanguage(nav: NavContext): string
```

---

### `VERSION`

The current library version, matching the `version` field in `package.json`.

```typescript
VERSION: string
```
