# API Reference

## Default Export

### `uaBrowser(ua?)`

Parse a UA string and return a full environment info object.

```typescript
import uaBrowser from 'ua-browser'

uaBrowser(ua?: string): EnvOption
```

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `ua` | `string` | Optional. UA string. Omit to read `navigator.userAgent` automatically. |

**Returns:** [`EnvOption`](/en/api/types#envoption)

```typescript
uaBrowser.isWebview(ua: string): boolean
uaBrowser.isWechatMiniapp(): boolean
uaBrowser.getLanguage(nav: NavContext): string
uaBrowser.VERSION: string
```

---

## Named Exports

### `parseUA(ua, options?)`

Pure function version, suitable for SSR / Node.js environments.

```typescript
import { parseUA } from 'ua-browser'

parseUA(ua: string, options?: ParseOptions): EnvOption
```

```typescript
interface ParseOptions {
  nav?: NavContext       // inject browser environment context
  windowsVersion?: string | null  // pre-resolved Windows version
}
```

---

### `isWebview(ua)`

Detect whether the UA contains `; wv` (Android Webview marker).

```typescript
isWebview(ua: string): boolean
```

---

### `isWechatMiniapp()`

Detect whether the current environment is a WeChat Mini Program.

```typescript
isWechatMiniapp(): boolean
```

---

### `getWindowsVersion(nav)`

Asynchronously get the accurate Windows version (to distinguish Windows 10 / 11).

```typescript
getWindowsVersion(nav: NavContext): Promise<string | null>
```

`await` this before calling `parseUA`, then pass the result as the `windowsVersion` option.

> **Note:** Requires `navigator.userAgentData` (Client Hints API). Browser-only — returns `null` in Node.js or when the API is unavailable.

---

### `detectBot(ua)`

Standalone bot detector.

```typescript
detectBot(ua: string): { isBot: boolean; botName: BotName }
```

---

### `detectArch(ua)`

Standalone CPU architecture detector.

```typescript
detectArch(ua: string): ArchName
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
